import {Core, load_from_storage, set_in_storage} from '@feltcoop/dealt';
import {EMPTY_OBJECT, type Flavored, type Uuid} from '@feltjs/util';
import {derived, type Readable} from 'svelte/store';

import {type ProjectMetadata, DEFAULT_PROJECT_NAME, type ProjectId} from '$lib/project';
import {next_unique_name} from '$lib/item_helpers';

export type AppId = Flavored<string, 'AppId'>;
const DEFAULT_APP_ID: AppId = 'app';

export type SceneId = Flavored<Uuid, 'SceneId'>;

export interface AppData {
	id: AppId;
	projects: ProjectMetadata[];
	selected_project_id: ProjectId | null;
}

// TODO maybe reduce the scope to `projects`? does the selection belong in the UI?
export class App extends Core {
	id: AppId;

	constructor(data?: Partial<AppData> | null) {
		super();
		console.log(`new App data`, data);

		const {
			id = DEFAULT_APP_ID,
			projects = to_default_projects(),
			selected_project_id = projects[0].id,
		} = data || (EMPTY_OBJECT as Partial<AppData>);

		this.id = id;
		this.projects.set(projects);
		this.selected_project_id.set(selected_project_id);

		this.subscribe();
	}

	$projects!: ProjectMetadata[];
	projects = this.writable<ProjectMetadata[]>('projects', []);

	$selected_project_id!: ProjectId | null;
	selected_project_id = this.writable<ProjectId | null>('selected_project_id', null);

	selected_project: Readable<ProjectMetadata | null> = derived(
		[this.projects, this.selected_project_id],
		([$projects, $selected_project_id]) =>
			$projects.find((s) => s.id === $selected_project_id) ?? null,
	);

	to_data(): AppData {
		return {
			id: this.id,
			projects: this.$projects,
			selected_project_id: this.$selected_project_id,
		};
	}

	save(): void {
		const data = this.to_data();
		set_in_storage(App.to_storage_key(data.id), data);
	}

	static load(id = DEFAULT_APP_ID): AppData | undefined {
		return load_from_storage(App.to_storage_key(id), () => undefined);
	}

	static to_storage_key(id: string): string {
		return 'app:' + id;
	}

	create_project(): ProjectMetadata {
		const project: ProjectMetadata = {
			id: crypto.randomUUID(),
			name: next_unique_name(this.$projects, DEFAULT_PROJECT_NAME),
		};
		this.projects.update((p) => p.concat(project));
		return project;
	}

	delete_project(id: ProjectId): boolean {
		const project = this.$projects.find((p) => p.id === id);
		if (!project) return false;
		if (this.$selected_project_id === id) {
			this.selected_project_id.set(null);
		}
		this.projects.update((p) => p.filter((p) => p.id !== id));
		return true;
	}
}

const to_default_projects = (): ProjectMetadata[] => [
	{id: crypto.randomUUID(), name: DEFAULT_PROJECT_NAME},
];
