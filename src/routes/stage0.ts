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
		obstacle2.speed = 0.03;
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
		const {controller, controlled, target, entity0, entity1} = this;

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
				// eslint-disable-next-line no-alert
				alert('you win!!'); // TODO  maybe go to `/in`?
				target.ghostly = true;
				// this.restart();
			} else if (
				(entityA === controlled && entityB === entity0) ||
				(entityB === controlled && entityA === entity0)
			) {
				this.swapControl(entity0);
			} else if (
				(entityA === controlled && entityB === entity1) ||
				(entityB === controlled && entityA === entity1)
			) {
				this.swapControl(entity1);
			}
			collide(entityA, entityB, result);
		});

		updateEntityDirection(controller, controlled, this.$camera, this.$viewport, this.$layout);

		if (!this.bounds.body.collides(this.controlled.body, collisionResult)) {
			this.restart();
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

	swapControl(entity: Entity<EntityCircle>): void {
		const {controlled} = this;
		if (controlled === entity) return;
		if (controlled) {
			const timeElapsed = this.time - this.timeLastSwapped;
			if (timeElapsed < CONTROL_SWAP_COOLDOWN) return;
			controlled.graphicsFillColor = 0;
			controlled.graphicsFillAlpha = 0;
		}
		this.timeLastSwapped = this.time;
		this.controlled = entity;
		entity.graphicsFillColor = hslToHex(...COLOR_PLAYER);
		entity.graphicsFillAlpha = 1;
	}
}
