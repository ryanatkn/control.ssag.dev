<script lang="ts">
	import type {StageData, Stage} from '@feltcoop/dealt';

	export let stage: Stage; // TODO should this be a store? a component instance? refactor this component instead?
	export let data: Partial<StageData> | null = null;

	// TODO sohuld this be `StageDetails` or `SceneDetails` or something else?

	let cameraUnlocked = !(data?.freezeCamera ?? false); // TODO see elsewhere too

	$: stage, updateFromData(data);
	const updateFromData = (data: Partial<StageData> | null) => {
		console.log(`updateFromData`, data);
		cameraUnlocked = !(data?.freezeCamera ?? false); // TODO see elsewhere too
		if (data) {
			stage.loadData(data);
		}
	};

	$: meta = (stage.constructor as typeof Stage).meta;
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
					<div class="title">freezeCamera</div>
					<input type="checkbox" bind:checked={cameraUnlocked} />
				</label>
			</fieldset>
		</div>
	</form>
	<!-- TODO restart stage button -->
	<button class="flush" on:click={() => stage.destroy()}>destroy stage</button>
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
