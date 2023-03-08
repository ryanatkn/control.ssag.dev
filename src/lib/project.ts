import {Core} from '@feltcoop/dealt';

export interface ProjectData {
	scenes: SceneData;
}

export interface SceneData {
	name: string;
}

export class Project extends Core {
	name = this.writable('name', 'project_name');
}
