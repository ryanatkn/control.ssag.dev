import {Collisions} from '@ryanatkn/collisions';
import {
	Stage,
	Simulation,
	Entity,
	COLOR_PLAYER,
	COLOR_EXIT,
	updateEntityDirection,
	collide,
	collisionResult,
	type StageMeta,
	type EntityCircle,
	type EntityPolygon,
	type Renderer,
	hslToHex,
	COLOR_DEFAULT,
	COLOR_ROOTED,
} from '@feltcoop/dealt';
import {COLOR_DANGER} from './constants';

// TODO rewrite this to use a route Svelte component? `dealt.dev/membrane/home`

// TODO what if this file were named `home.stage.ts` instead of `stage0.ts` ?

const meta: StageMeta = {
	name: 'stage0',
	icon: '🐭',
};

const RADIUS = 5;
const CONTROL_SWAP_COOLDOWN = 1000;
const COLOR_PLAYER_HEX = hslToHex(...COLOR_PLAYER);

export class Stage0 extends Stage {
	static override meta = meta;

	// these are instantiated in `setup`
	entity0!: Entity<EntityCircle>;
	entity1!: Entity<EntityCircle>;
	bounds!: Entity<EntityPolygon>;
	target!: Entity<EntityCircle>;

	controlled!: Entity<EntityCircle>;

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		const collisions = (this.collisions = new Collisions());
		this.sim = new Simulation(collisions);

		// create the controllable player
		const entity0 = (this.entity0 = new Entity(
			collisions.createCircle(100, 147, RADIUS) as EntityCircle,
		));
		entity0.speed = 0.2;
		this.swapControl(entity0);
		this.addEntity(entity0);

		const entity1 = (this.entity1 = new Entity(
			collisions.createCircle(120, 100, RADIUS / 3) as EntityCircle,
		));
		entity1.speed = 0.09;
		this.addEntity(entity1);

		// create the bounds around the stage edges
		const bounds = (this.bounds = new Entity(
			collisions.createPolygon(0, 0, [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1],
			]) as EntityPolygon,
		));
		bounds.invisible = true;
		bounds.ghostly = true;
		bounds.body.scale_x = this.$camera.width;
		bounds.body.scale_y = this.$camera.height;
		this.addEntity(bounds);

		// TODO create these programmatically from data

		const target = (this.target = new Entity(
			collisions.createCircle(230, 15, RADIUS * 2) as EntityCircle,
		));
		target.color = COLOR_EXIT;
		target.speed = 0.03;
		this.addEntity(target);

		// create some things
		const obstacle1 = new Entity(collisions.createCircle(150, 110, RADIUS * 4) as EntityCircle);
		obstacle1.color = COLOR_DANGER;
		obstacle1.speed = 0.03;
		this.addEntity(obstacle1);
		const obstacle2 = new Entity(collisions.createCircle(200, 35, RADIUS * 3) as EntityCircle);
		obstacle2.color = COLOR_DANGER;
		obstacle2.speed = 0.13;
		this.addEntity(obstacle2);
		const obstacle3 = new Entity(collisions.createCircle(250, 70, RADIUS * 8) as EntityCircle);
		obstacle3.color = COLOR_DANGER;
		obstacle3.speed = 0.03;
		this.addEntity(obstacle3);
		const obstacle4 = new Entity(collisions.createCircle(150, -70, RADIUS * 20) as EntityCircle);
		obstacle4.color = COLOR_DANGER;
		obstacle4.speed = 0.03;
		this.addEntity(obstacle4);

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
				const entity = (entityA === controlled ? entityB : entityA) as Entity<EntityCircle>;
				if (this.swapControl(entity)) {
					controlled = entity;
				}
			}
			collide(entityA, entityB, result);
		});

		updateEntityDirection(controller, controlled, this.$camera, this.$viewport, this.$layout);

		if (this.freezeCamera) {
			if (!this.bounds.body.collides(controlled.body, collisionResult)) {
				this.restart();
			}
		} else {
			this.camera.setPosition(controlled.x, controlled.y);
		}

		if (this.shouldRestart) {
			this.exit({next_stage: meta.name});
		}
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.entities);
	}

	shouldRestart = false; // this is a flag because we want to do it after updating, otherwise disposed entities get updated and throw errors
	restart(): void {
		this.shouldRestart = true;
	}

	timeLastSwapped = 0;

	swapControl(entity: Entity<EntityCircle>): boolean {
		const {controlled} = this;
		if (controlled === entity) return false;
		if (controlled) {
			const timeElapsed = this.time - this.timeLastSwapped;
			if (timeElapsed < CONTROL_SWAP_COOLDOWN) return false;
			controlled.graphicsFillColor = 0;
			controlled.graphicsFillAlpha = 0;
			controlled.directionX = 0;
			controlled.directionY = 0;
		}
		this.timeLastSwapped = this.time;
		this.controlled = entity;
		entity.graphicsFillColor = COLOR_PLAYER_HEX;
		entity.graphicsFillAlpha = 1;
		this.freezeCamera = entity.radius < RADIUS * 3;
		return true;
	}

	collideWithTarget(): void {
		for (const entity of this.sim.entities) {
			if (entity.color === COLOR_DANGER) {
				entity.color = COLOR_DEFAULT;
			} else if (entity === this.target) {
				entity.color = COLOR_ROOTED;
			}
		}
	}
}
