import {
	Stage,
	Item,
	COLOR_PLAYER,
	COLOR_EXIT,
	update_item_direction,
	collide,
	cr,
	type StageMeta,
	type CircleBody,
	type PolygonBody,
	hsl_to_hex,
	COLOR_DEFAULT,
	COLOR_ROOTED,
	COLOR_DANGER,
	SPEED_SLOW,
	PLAYER_RADIUS,
	type ItemData,
	type StageData,
	create_item_id,
	hsl_to_hex_string,
	type StageOptions,
} from '@feltcoop/dealt';

import {WORLD_SIZE} from '$routes/constants';

// TODO rewrite this to use a route Svelte component?

// TODO what if this file were named `home.stage.ts` instead of `stage0.ts` ?

const meta: StageMeta = {
	name: 'stage0',
	icon: '🐭',
};

const CONTROL_SWAP_COOLDOWN = 1000;
const COLOR_PLAYER_HEX = hsl_to_hex(...COLOR_PLAYER);

export class Stage0 extends Stage {
	static override meta = meta;

	// these are instantiated in `setup`
	pointer!: Item<CircleBody>;
	bounds!: Item<PolygonBody>;
	target!: Item<CircleBody>;
	rabbit!: Item<CircleBody>;
	rabbit_message!: Item<CircleBody>;
	chasing_rabbit = false;

	$camera_speed!: number;
	camera_speed = this.writable('camera_speed', 1.7);

	constructor(options: StageOptions) {
		super(options);

		this.subscribe(); // TODO hacky, shouldn't be needed, not sure how -- maybe call in `Stage.setup`?
	}

	static override create_initial_data(): Partial<StageData> {
		const items: Array<Partial<ItemData>> = [];
		const data: Partial<StageData> = {freeze_camera: true, items};

		const controlled = {
			type: 'circle', // TODO needs type safety, should error when omitted
			id: create_item_id(),
			x: 100,
			y: 147,
			radius: PLAYER_RADIUS,
			speed: SPEED_SLOW,
			freeze_camera: true,
		} satisfies Partial<ItemData>;
		items.push(controlled);
		data.controlled = controlled.id;

		// create the little one
		items.push({
			type: 'circle',
			x: 120,
			y: 100,
			radius: PLAYER_RADIUS / 3,
			speed: SPEED_SLOW / 2,
			freeze_camera: true,
		});

		// create the bounds
		items.push({
			type: 'polygon',
			x: 0,
			y: 0,
			points: [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1],
			],
			invisible: true,
			ghostly: true,
			scale_x: WORLD_SIZE,
			scale_y: WORLD_SIZE,
			tags: ['bounds'],
		});

		// create the target
		items.push({
			type: 'circle',
			x: 230,
			y: 15,
			radius: PLAYER_RADIUS * 2,
			color: COLOR_EXIT,
			speed: 0,
			strength: 100_000_000,
			tags: ['target'],
		});

		// create the rabbit
		items.push({
			type: 'circle',
			x: 310,
			y: -10,
			radius: PLAYER_RADIUS * 5,
			color: COLOR_EXIT,
			speed: (SPEED_SLOW / 2) * 1.01, // unfair D:
			strength: 1_000_000_000,
			tags: ['rabbit'],
			text: '🐰',
			font_size: 36,
		});
		items.push({
			type: 'circle',
			tags: ['rabbit_message'],
			text: '',
			font_size: 24,
			text_fill: hsl_to_hex_string(...COLOR_ROOTED),
			ghostly: true,
			invisible: true,
		});

		// create some things
		items.push({
			type: 'circle',
			x: 150,
			y: 110,
			radius: PLAYER_RADIUS * 4,
			color: COLOR_DANGER,
			speed: 0.03,
		});
		items.push({
			type: 'circle',
			x: 200,
			y: 35,
			radius: PLAYER_RADIUS * 3,
			color: COLOR_DANGER,
			speed: 0.17,
		});
		items.push({
			type: 'circle',
			x: 250,
			y: 70,
			radius: PLAYER_RADIUS * 8,
			color: COLOR_DANGER,
			speed: 0.022,
		});
		items.push({
			type: 'circle',
			x: 150,
			y: -70,
			radius: PLAYER_RADIUS * 20,
			color: COLOR_DANGER,
			speed: 0.007,
		});

		console.log(`create_initial_data`, data);

		return data;
	}

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		// TODO should be a point?
		this.pointer = new Item<CircleBody>(this.collisions, {
			type: 'circle',
			x: undefined,
			y: undefined,
			radius: 1,
			invisible: true,
		});
		this;

		// TODO do this better, maybe with `tags` automatically, same with `bounds`
		for (const item of this.item_by_id.values()) {
			if (item.$tags?.includes('bounds')) {
				this.bounds = item as Item<PolygonBody>;
			} else if (item.$tags?.includes('target')) {
				this.target = item as Item<CircleBody>;
			} else if (item.$tags?.includes('rabbit')) {
				this.rabbit = item as Item<CircleBody>;
			} else if (item.$tags?.includes('rabbit_message')) {
				this.rabbit_message = item as Item<CircleBody>;
			}
		}
		this.swap_control(this.$controlled, true);
		console.log('set up');
	}

	override update(dt: number): void {
		const {controller, target, rabbit} = this;
		let {$controlled} = this;

		super.update(dt);

		this.sim.update(dt, (item_a, item_b, cr) => {
			// TODO make a better system
			if (
				(item_a.$color === COLOR_DEFAULT && item_b.$color === COLOR_DANGER) ||
				(item_b.$color === COLOR_DEFAULT && item_a.$color === COLOR_DANGER)
			) {
				const destroyed = item_a.$color === COLOR_DANGER ? item_b : item_a;
				if (destroyed === $controlled) {
					this.restart();
				} else {
					this.remove_item(destroyed);
				}
			} else if (
				(item_a === $controlled && item_b === target) ||
				(item_b === $controlled && item_a === target)
			) {
				this.collide_with_target();
			} else if (
				(item_a === $controlled && item_b === rabbit) ||
				(item_b === $controlled && item_a === rabbit)
			) {
				this.collide_with_rabbit();
			} else if (
				(item_a === $controlled && item_b.$color === COLOR_DEFAULT) ||
				(item_b === $controlled && item_a.$color === COLOR_DEFAULT)
			) {
				const item = (item_a === $controlled ? item_b : item_a) as Item<CircleBody>;
				if (this.swap_control(item)) {
					$controlled = this.$controlled; // is a bit hacky
				}
			}
			collide(item_a, item_b, cr);
		});

		if ($controlled) {
			update_item_direction(controller, $controlled, this.$camera, this.$viewport, this.$layout);

			if (this.$freeze_camera) {
				if (!this.bounds.$body.collides($controlled.$body, cr)) {
					if (this.has_any_danger()) {
						this.restart();
					} else {
						this.freeze_camera.set(false);
						$controlled.freeze_camera.set(false);
					}
				}
			} else {
				// TODO different algorithms for tracking the player with the camera (`camera.follow` option?)
				this.camera.set_position($controlled.$x, $controlled.$y);
			}
		} else {
			// TODO should the camera be an `item`? could do collision if so and not need this special logic (see `update_item_direction`)
			const {moving_left, moving_right, moving_up, moving_down} = controller;
			const direction_x = moving_left && !moving_right ? -1 : moving_right && !moving_left ? 1 : 0;
			const direction_y = moving_up && !moving_down ? -1 : moving_down && !moving_up ? 1 : 0;
			if (direction_x !== 0 || direction_y !== 0) {
				this.camera.set_position(
					this.$camera.x + direction_x * this.$camera_speed,
					this.$camera.y + direction_y * this.$camera_speed,
				);
			}

			// TODO BLOCK check `this.pointer` collision against all other items
			// TODO BLOCK update the pointer position
		}

		// TODO currently checks for `$freeze_camera` toggling on the rabbit's chase mode,
		// would be better to check the rabbit against the camera, so it starts running away when onscreen,
		// and so we'll have that reusable scriptable ability trigger, "when onscreen"
		if (!this.$freeze_camera && !this.chasing_rabbit) {
			this.chasing_rabbit = true;
			rabbit.direction_x = Math.SQRT1_2;
			rabbit.direction_y = -Math.SQRT1_2;
		}

		if (this.needs_restart) {
			this.exit({next_stage: meta.name});
		}
	}

	// TODO rethink - maybe a more generic API?
	has_any_danger(): boolean {
		for (const item of this.sim.items) {
			if (item.$color === COLOR_DANGER) return true;
		}
		return false;
	}

	needs_restart = false; // this is a flag because we want to do it after updating, otherwise disposed items get updated and throw errors
	restart(): void {
		this.needs_restart = true;
	}

	time_last_swapped: number | undefined;

	swap_control(item: Item | null, force = false): boolean {
		const {$controlled, time} = this;
		if ($controlled === item) {
			if (!force) return false;
			this.time_last_swapped = undefined;
		}
		if ($controlled) {
			// respect the swap timer unless `force=true`
			if (!force && this.time_last_swapped !== undefined) {
				const timeElapsed = time - this.time_last_swapped;
				if (time > CONTROL_SWAP_COOLDOWN && timeElapsed < CONTROL_SWAP_COOLDOWN) {
					return false;
				}
			}
			$controlled.fill_color.set(0);
			$controlled.fill_alpha.set(0);
			$controlled.direction_x = 0;
			$controlled.direction_y = 0;
		}
		this.time_last_swapped = time;
		this.controlled.set(item);
		if (item) {
			item.fill_color.set(COLOR_PLAYER_HEX);
			item.fill_alpha.set(1);
			this.freeze_camera.set(item.$freeze_camera ?? false);
		}
		return true;
	}

	// TODO refactor these into a good system
	collide_with_rabbit(): void {
		const {rabbit, rabbit_message} = this;
		if (rabbit.$color !== COLOR_ROOTED) {
			// TODO it'd be nice to stop the clock here, but we don't have it in the stage interface
			rabbit.color.set(COLOR_ROOTED);
			rabbit.direction_x = 0;
			rabbit.direction_y = 0;
			rabbit_message.invisible.set(false);
			rabbit_message.x.set(rabbit.$x + 80);
			rabbit_message.y.set(rabbit.$y + 20);
			rabbit_message.text.set('DONT\n  press\nEscape !!');
			rabbit_message.line_width.set(0);
		}
	}

	collide_with_target(): void {
		for (const item of this.sim.items) {
			if (item.$color === COLOR_DANGER) {
				item.color.set(COLOR_DEFAULT);
			}
		}
		this.target.color.set(COLOR_ROOTED);
	}

	handle_pointer_down(x: number, y: number): Item | null {
		if (this.$controlled) {
			// move towards mouse
			// TODO BLOCK this is currently all done in `update` --
			// what's the desired way to oraganize things?
			// I think it makes sense to minimize `update`,
			// like we do `setup` in favor of `create_initial_data`.
			// Should the `controller` have store values, and we do this logic in a `this.writable` callback?
		} else {
			const {pointer} = this;
			// TODO BLOCK translate `x` and `y` to world coordinates
			pointer.x.set(x);
			pointer.y.set(y);
			console.log(`pointer.$x, pointer.$y`, pointer.$x, pointer.$y);
			for (const item of this.sim.items) {
				if (item.$body.collides(pointer.$body)) {
					return item;
				}
			}
		}
		return null;
	}
}
