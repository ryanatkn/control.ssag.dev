import type {Flavored, Uuid} from '@feltjs/util';

export type SceneId = Flavored<Uuid, 'SceneId'>;

export interface SceneData {
	id: SceneId;
	name: string;
	// stage: string; // TODO ?
}

export const DEFAULT_SCENE_NAME = 'new scene';
