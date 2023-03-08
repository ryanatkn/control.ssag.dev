<script lang="ts">
	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0; // TODO should this be a store? a component instance? refactor this component instead?

	$: ({freezeCamera, camera} = stage);

	$: ({x, y} = $camera);

	// TODO type is awkward
	const updateX = (e: Event & {target: any}) => camera.setPosition(Number(e.target.value), y);
	const updateY = (e: Event & {target: any}) => camera.setPosition(x, Number(e.target.value));
</script>

<div class="camera-details">
	<form>
		<div>
			<fieldset>
				<label class="row">
					<input type="checkbox" bind:checked={$freezeCamera} />
					<div class="title">freezeCamera</div>
				</label>
			</fieldset>
			<fieldset class="row">
				<label
					><span class="title">x</span><input type="number" value={x} on:input={updateX} /></label
				>
				<label
					><span class="title">y</span><input type="number" value={y} on:input={updateY} /></label
				>
			</fieldset>
		</div>
	</form>
</div>

<style>
	.camera-details {
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
