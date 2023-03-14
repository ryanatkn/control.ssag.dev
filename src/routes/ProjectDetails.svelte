<script lang="ts">
	import type {Project} from '$lib/project';
	import type {App} from '$lib/app';

	export let app: App; // TODO should this be a store? a component instance? refactor this component instead?
	export let project: Project; // TODO should this be a store? a component instance? refactor this component instead?

	$: ({selected_project_id, projects} = app);
	$: ({name, scenes, selected_scene_id} = project);

	// TODO BLOCK keep `name` in sync below with `app.projects` metadata, but how?
</script>

<div class="project-details">
	<form>
		<fieldset>
			<label>
				<div class="title">selected_project</div>
				<select bind:value={$selected_project_id}>
					{#each $projects as project (project)}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>
			</label>
			<button on:click={() => app.create_project()}>create new project</button>
		</fieldset>
		<fieldset class="row">
			<label>
				<div class="title">project name</div>
				<!-- TODO app metadata gets out of sync with this -- should it have its live list of projects instead? -->
				<input bind:value={$name} />
			</label>
		</fieldset>
		<fieldset>
			<button
				on:click={() => {
					// TODO BLOCK hacky
					app.save();
					project.save();
				}}>save changes</button
			>
		</fieldset>
		<fieldset>
			<label>
				<div class="title">selected_scene</div>
				<select bind:value={$selected_scene_id}>
					{#each $scenes as scene (scene)}
						<option value={scene.id}>{scene.name}</option>
					{/each}
				</select>
			</label>
			<button on:click={() => project.create_scene()}>create new scene</button>
		</fieldset>
		<fieldset>
			<button on:click={() => app.delete_project(project.id)}>delete project</button>
		</fieldset>
		<!-- <fieldset>
			<div class="title">selected_project</div>
			<select bind:value={$selected_project_id}>
				{#each $projects as project (project)}
					<option value={project.id}>{project.name}</option>
				{/each}
			</select>
			<button>create project</button>
		</fieldset> -->
	</form>
</div>

<style>
	.project-details {
		display: flex;
		flex-direction: column;
	}

	form {
		flex: 1;
	}

	fieldset {
		margin-bottom: var(--spacing_md);
	}
</style>
