import {Core, load_from_storage, set_in_storage} from '@feltcoop/dealt';
import {EMPTY_OBJECT, type Flavored, type Uuid} from '@feltjs/util';
import {derived, type Readable} from 'svelte/store';

import {DEFAULT_SCENE_NAME, type SceneData} from '$lib/scene';
import {next_unique_name} from '$lib/item_helpers';

export type ProjectId = Flavored<Uuid, 'ProjectId'>;

export interface ProjectMetadata {
	id: string;
	name: string;
}

export interface ProjectData {
	id: ProjectId;
	name: string;
	scenes: SceneData[];
	selected_scene_id: Uuid | null;
}

export const DEFAULT_PROJECT_NAME = 'new project';

export class Project extends Core {
	id: ProjectId;

	constructor(data?: Partial<ProjectData> | null) {
		super();
		console.log(`new Project data`, data);

		const {
			id = crypto.randomUUID(),
			name = DEFAULT_PROJECT_NAME,
			scenes = to_default_scenes(),
			selected_scene_id = scenes[0].id,
		} = data || (EMPTY_OBJECT as Partial<ProjectData>);

		this.id = id;
		this.name.set(name);
		this.scenes.set(scenes);
		this.selected_scene_id.set(selected_scene_id);

		this.subscribe();
	}

	$name!: string;
	name = this.writable('name', '');

	$scenes!: SceneData[];
	scenes = this.writable<SceneData[]>('scenes', []);

	$selected_scene_id!: Uuid | null;
	selected_scene_id = this.writable<Uuid | null>('selected_scene_id', null);

	selected_scene: Readable<SceneData | null> = derived(
		[this.scenes, this.selected_scene_id],
		([$scenes, $selected_scene_id]) => $scenes.find((s) => s.id === $selected_scene_id) ?? null,
	);

	to_data(): ProjectData {
		return {
			id: this.id,
			name: this.$name,
			scenes: this.$scenes,
			selected_scene_id: this.$selected_scene_id,
		};
	}

	save(): void {
		const data = this.to_data();
		set_in_storage(Project.to_storage_key(data.id), data);
	}

	static load(id: string): ProjectData | undefined {
		return load_from_storage(Project.to_storage_key(id), () => undefined);
	}

	static to_storage_key(id: string): string {
		return 'project:' + id;
	}

	create_scene(): SceneData {
		const scene: SceneData = {
			id: crypto.randomUUID(),
			name: next_unique_name(this.$scenes, DEFAULT_SCENE_NAME),
		};
		this.scenes.update((s) => s.concat(scene));
		return scene;
	}
}

const to_default_scenes = (): SceneData[] => [{id: crypto.randomUUID(), name: DEFAULT_SCENE_NAME}];
