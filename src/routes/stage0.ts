import {
	Stage,
	Entity,
	COLOR_PLAYER,
	COLOR_EXIT,
	updateEntityDirection,
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
	type EntityData,
	type StageData,
	createEntityId,
} from '@feltcoop/dealt';

import {COLOR_DANGER} from './constants';

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
	bounds!: Entity<PolygonBody>;
	target!: Entity<CircleBody>;

	static override toInitialData(): Partial<StageData> {
		const entities: Array<Partial<EntityData>> = [];
		const data: Partial<StageData> = {freezeCamera: true, entities};

		const controlled = {
			type: 'circle', // TODO needs type safety, should error when omitted
			id: createEntityId(),
			x: 100,
			y: 147,
			radius: PLAYER_RADIUS,
			speed: SPEED_SLOW,
			freezeCamera: true,
		} satisfies Partial<EntityData>;
		entities.push(controlled);
		data.controlled = controlled.id;

		entities.push({
			type: 'circle',
			x: 120,
			y: 100,
			radius: PLAYER_RADIUS / 3,
			speed: 0.045,
			freezeCamera: true,
		});

		// create some things
		entities.push({
			type: 'circle',
			x: 150,
			y: 110,
			radius: PLAYER_RADIUS * 4,
			color: COLOR_DANGER,
			speed: 0.03,
		});
		entities.push({
			type: 'circle',
			x: 200,
			y: 35,
			radius: PLAYER_RADIUS * 3,
			color: COLOR_DANGER,
			speed: 0.13,
		});
		entities.push({
			type: 'circle',
			x: 250,
			y: 70,
			radius: PLAYER_RADIUS * 8,
			color: COLOR_DANGER,
			speed: 0.022,
		});
		entities.push({
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
		const {collisions} = this;

		// create the bounds around the stage edges
		const bounds = (this.bounds = new Entity(collisions, {
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
			scale_x: this.$camera.width,
			scale_y: this.$camera.height,
		}));
		this.addEntity(bounds);

		// TODO create these programmatically from data (tags?)

		const target = (this.target = new Entity(collisions, {
			x: 230,
			y: 15,
			radius: PLAYER_RADIUS * 2,
		}));
		target.color = COLOR_EXIT;
		target.speed = 0.03;
		this.addEntity(target);

		console.log('set up');
	}

	override update(dt: number): void {
		const {controller, target} = this;
		let {controlled} = this;

		super.update(dt);

		this.sim.update(dt, (entityA, entityB, result) => {
			// TODO make a better system
			if (
				(entityA === controlled && entityB.color === COLOR_DANGER) ||
				(entityB === controlled && entityA.color === COLOR_DANGER)
			) {
				this.restart();
			} else if (
				(entityA === controlled && entityB === target) ||
				(entityB === controlled && entityA === target)
			) {
				this.collideWithTarget();
			} else if (
				(entityA === controlled && entityB.color === COLOR_DEFAULT) ||
				(entityB === controlled && entityA.color === COLOR_DEFAULT)
			) {
				const entity = (entityA === controlled ? entityB : entityA) as Entity<CircleBody>;
				if (this.swapControl(entity)) {
					controlled = entity;
				}
			}
			collide(entityA, entityB, result);
		});

		if (controlled) {
			updateEntityDirection(controller, controlled, this.$camera, this.$viewport, this.$layout);

			if (this.freezeCamera && !this.bounds.body.collides(controlled.body, collisionResult)) {
				if (this.hasAnyDanger()) {
					this.restart();
				} else {
					this.freezeCamera = false;
					controlled.freezeCamera = false;
				}
			}
		}

		if (this.shouldRestart) {
			this.exit({next_stage: meta.name});
		}
	}

	// TODO rethink - maybe a more generic API?
	hasAnyDanger(): boolean {
		for (const entity of this.sim.entities) {
			if (entity.color === COLOR_DANGER) return true;
		}
		return false;
	}

	shouldRestart = false; // this is a flag because we want to do it after updating, otherwise disposed entities get updated and throw errors
	restart(): void {
		this.shouldRestart = true;
	}

	timeLastSwapped: number | undefined;

	swapControl(entity: Entity<CircleBody>): boolean {
		const {controlled} = this;
		if (controlled === entity) return false;
		if (controlled) {
			if (this.timeLastSwapped !== undefined) {
				const timeElapsed = this.time - this.timeLastSwapped;
				if (timeElapsed < CONTROL_SWAP_COOLDOWN) return false;
			}
			controlled.graphicsFillColor = 0;
			controlled.graphicsFillAlpha = 0;
			controlled.directionX = 0;
			controlled.directionY = 0;
		}
		this.timeLastSwapped = this.time;
		this.controlled = entity;
		entity.graphicsFillColor = COLOR_PLAYER_HEX;
		entity.graphicsFillAlpha = 1;
		if (entity.freezeCamera !== undefined) this.freezeCamera = entity.freezeCamera;
		return true;
	}

	collideWithTarget(): void {
		for (const entity of this.sim.entities) {
			if (entity.color === COLOR_DANGER) {
				entity.color = COLOR_DEFAULT;
			}
		}
		this.target.color = COLOR_ROOTED;
	}
}
