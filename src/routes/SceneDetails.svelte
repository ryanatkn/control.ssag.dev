<script lang="ts">
	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0; // TODO should this be a store? a component instance? refactor this component instead?

	// TODO sohuld this be `StageDetails` or `SceneDetails` or something else?

	$: ({freezeCamera} = stage);

	$: meta = (stage.constructor as typeof Stage0).meta;
</script>

<div class="scene-details">
	<h2 class="pane-title">scene details</h2>
	<form>
		<div>
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
			<fieldset>
				<label class="row">
					<input type="checkbox" bind:checked={$freezeCamera} />
					<div class="title">freezeCamera</div>
				</label>
			</fieldset>
		</div>
	</form>
	<!-- TODO restart stage button -->
	<div class="row">
		<button class="flush" on:click={() => stage.destroy()}>destroy stage</button>
		<button class="flush" on:click={() => stage.restart()}>restart stage</button>
	</div>
</div>

<style>
	.scene-details {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	form {
		overflow: auto;
		flex: 1;
	}

	fieldset {
		margin-bottom: var(--spacing_md);
	}
</style>
