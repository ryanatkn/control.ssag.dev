<script lang="ts">
	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0; // TODO should this be a store? a component instance? refactor this component instead?

	// TODO sohuld this be `StageDetails` or `SceneDetails` or something else?

	$: meta = (stage.constructor as typeof Stage0).meta;
</script>

<div class="scene-details">
	<form>
		<fieldset class="row">
			<label>
				<div class="title">stage name</div>
				<input value={meta.name} />
			</label>
			<label>
				<div class="title">stage icon</div>
				<input value={meta.icon} />
			</label>
		</fieldset>
	</form>
	<div class="row">
		<button on:click={() => stage.destroy()}> destroy stage </button>
		<button on:click={() => stage.restart()} title="restart stage [r]"> restart stage </button>
	</div>
</div>

<style>
	.scene-details {
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
