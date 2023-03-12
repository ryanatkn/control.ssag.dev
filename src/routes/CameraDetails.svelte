<script lang="ts">
	import type {Stage0} from '$routes/stage0';
	import {WORLD_SIZE} from '$routes/constants';

	export let stage: Stage0; // TODO should this be a store? a component instance? refactor this component instead?

	$: ({freeze_camera, camera, camera_speed} = stage);

	$: ({x, y} = $camera);

	// TODO type is awkward
	const updateX = (e: Event & {target: any}) => camera.set_position(Number(e.target.value), y);
	const updateY = (e: Event & {target: any}) => camera.set_position(x, Number(e.target.value));
	// TODO upstream `setScale`
	// const updateScale = (e: Event & {target: any}) => camera.setScale(Number(e.target.value));
</script>

<div class="camera-details">
	<form>
		<fieldset>
			<label>
				<input type="checkbox" bind:checked={$freeze_camera} />
				<div class="title">freeze_camera</div>
			</label>
		</fieldset>
		<fieldset class="row">
			<label>
				<span class="title">x</span>
				<input type="number" value={x} on:input={updateX} />
				<input type="range" value={x} on:input={updateX} min={0} max={WORLD_SIZE} />
			</label>
			<label>
				<span class="title">y</span>
				<input type="number" value={y} on:input={updateY} />
				<input type="range" value={y} on:input={updateY} min={0} max={WORLD_SIZE} />
			</label>
		</fieldset>
		<fieldset>
			<label>
				<span class="title">speed</span>
				<div class="row">
					<input type="range" bind:value={$camera_speed} min={0} max={4} step={0.1} />
					<input type="number" bind:value={$camera_speed} min={0} step={0.1} />
				</div>
			</label>
		</fieldset>
		<!-- TODO upstream `setScale` -->
		<!-- <fieldset>
				<label>
					<span class="title">scale</span>
					<input type="number" value={scale} on:input={updateScale} />
					<input type="range" value={scale} on:input={updateScale} min={0} max={10} />
				</label>
			</fieldset> -->
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

	fieldset:not(:last-child) {
		margin-bottom: var(--spacing_md);
	}
</style>
