<script lang="ts">
	import type {Project} from '$lib/project';

	export let project: Project; // TODO should this be a store? a component instance? refactor this component instead?

	// TODO

	$: ({name} = project);
</script>

<div class="project-details">
	<form>
		<fieldset class="row">
			<label>
				<div class="title">project name</div>
				<input bind:value={$name} />
			</label>
			<!-- maybe 3 emoji to represent it? -->
			<!-- <label>
					<div class="title">project icon</div>
					<input value="icon" />
				</label> -->
		</fieldset>
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
