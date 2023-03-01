import {
	Stage,
	Item,
	COLOR_PLAYER,
	COLOR_EXIT,
	updateItemDirection,
	collide,
	collisionResult,
	type StageMeta,
	type CircleBody,
	type PolygonBody,
	hslToHex,
	COLOR_DEFAULT,
	COLOR_ROOTED,
	SPEED_SLOW,
	PLAYER_RADIUS,
	type ItemData,
	type StageData,
	createItemId,
} from '@feltcoop/dealt';

import {COLOR_DANGER, WORLD_SIZE} from '$routes/constants';

// TODO rewrite this to use a route Svelte component? `dealt.dev/membrane/home`

// TODO what if this file were named `home.stage.ts` instead of `stage0.ts` ?

const meta: StageMeta = {
	name: 'stage0',
	icon: '🐭',
};

const CONTROL_SWAP_COOLDOWN = 1000;
const COLOR_PLAYER_HEX = hslToHex(...COLOR_PLAYER);

export class Stage0 extends Stage {
	static override meta = meta;

	// these are instantiated in `setup`
	bounds!: Item<PolygonBody>;
	target!: Item<CircleBody>;

	static override createInitialData(): Partial<StageData> {
		const items: Array<Partial<ItemData>> = [];
		const data: Partial<StageData> = {freezeCamera: true, items};

		const controlled = {
			type: 'circle', // TODO needs type safety, should error when omitted
			id: createItemId(),
			x: 100,
			y: 147,
			radius: PLAYER_RADIUS,
			speed: SPEED_SLOW,
			freezeCamera: true,
		} satisfies Partial<ItemData>;
		items.push(controlled);
		data.controlled = controlled.id;

		// create the little one
		items.push({
			type: 'circle',
			x: 120,
			y: 100,
			radius: PLAYER_RADIUS / 3,
			speed: 0.045,
			freezeCamera: true,
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
			speed: 0.13,
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

		console.log(`toInitialData`, data);

		return data;
	}

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		// TODO do this better, maybe with `tags` automatically, same with `bounds`
		for (const item of this.itemById.values()) {
			if (item.$tags?.includes('bounds')) {
				this.bounds = item as Item<PolygonBody>;
			} else if (item.$tags?.includes('target')) {
				this.target = item as Item<CircleBody>;
			}
		}
		this.swapControl(this.$controlled, true);
		console.log('set up');
	}

	override update(dt: number): void {
		const {controller, target} = this;
		let {$controlled} = this;

		super.update(dt);

		this.sim.update(dt, (itemA, itemB, result) => {
			// TODO make a better system
			if (
				(itemA.$color === COLOR_DEFAULT && itemB.$color === COLOR_DANGER) ||
				(itemB.$color === COLOR_DEFAULT && itemA.$color === COLOR_DANGER)
			) {
				const destroyed = itemA.$color === COLOR_DANGER ? itemB : itemA;
				if (destroyed === $controlled) {
					this.restart();
				} else {
					this.removeItem(destroyed);
				}
			} else if (
				(itemA === $controlled && itemB === target) ||
				(itemB === $controlled && itemA === target)
			) {
				this.collideWithTarget();
			} else if (
				(itemA === $controlled && itemB.$color === COLOR_DEFAULT) ||
				(itemB === $controlled && itemA.$color === COLOR_DEFAULT)
			) {
				const item = (itemA === $controlled ? itemB : itemA) as Item<CircleBody>;
				if (this.swapControl(item)) {
					$controlled = this.$controlled; // is a bit hacky
				}
			}
			collide(itemA, itemB, result);
		});

		if ($controlled) {
			updateItemDirection(controller, $controlled, this.$camera, this.$viewport, this.$layout);

			if (this.$freezeCamera) {
				if (!this.bounds.$body.collides($controlled.$body, collisionResult)) {
					if (this.hasAnyDanger()) {
						this.restart();
					} else {
						this.freezeCamera.set(false);
						$controlled.freezeCamera.set(false);
					}
				}
			} else {
				// TODO different algorithms for tracking the player with the camera (`camera.follow` option?)
				this.camera.setPosition($controlled.$x, $controlled.$y);
			}
		}

		if (this.shouldRestart) {
			this.exit({next_stage: meta.name});
		}
	}

	// TODO rethink - maybe a more generic API?
	hasAnyDanger(): boolean {
		for (const item of this.sim.items) {
			if (item.$color === COLOR_DANGER) return true;
		}
		return false;
	}

	shouldRestart = false; // this is a flag because we want to do it after updating, otherwise disposed items get updated and throw errors
	restart(): void {
		this.shouldRestart = true;
	}

	timeLastSwapped: number | undefined;

	swapControl(item: Item | null, force = false): boolean {
		const {$controlled, time} = this;
		if ($controlled === item) {
			if (!force) return false;
			this.timeLastSwapped = undefined;
		}
		if ($controlled) {
			if (this.timeLastSwapped !== undefined) {
				const timeElapsed = time - this.timeLastSwapped;
				if (time > CONTROL_SWAP_COOLDOWN && timeElapsed < CONTROL_SWAP_COOLDOWN) return false;
			}
			$controlled.graphicsFillColor.set(0);
			$controlled.graphicsFillAlpha.set(0);
			$controlled.directionX = 0;
			$controlled.directionY = 0;
		}
		this.timeLastSwapped = time;
		this.controlled.set(item);
		if (item) {
			item.graphicsFillColor.set(COLOR_PLAYER_HEX);
			item.graphicsFillAlpha.set(1);
			this.freezeCamera.set(item.$freezeCamera ?? false);
		}
		return true;
	}

	collideWithTarget(): void {
		for (const item of this.sim.items) {
			if (item.$color === COLOR_DANGER) {
				item.color.set(COLOR_DEFAULT);
			}
		}
		this.target.color.set(COLOR_ROOTED);
	}
}
