<script lang="ts">
	import type {Stage0} from '$routes/stage0';
	import {WORLD_SIZE} from '$routes/constants';

	export let stage: Stage0; // TODO should this be a store? a component instance? refactor this component instead?

	$: ({freeze_camera, camera, camera_speed} = stage);

	$: ({x, y} = $camera);

	// TODO type is awkward
	const update_x = (e: Event & {target: any}) => camera.set_position(Number(e.target.value), y);
	const update_y = (e: Event & {target: any}) => camera.set_position(x, Number(e.target.value));
	// TODO upstream `set_scale`
	// const update_scale = (e: Event & {target: any}) => camera.set_scale(Number(e.target.value));
</script>

<div class="camera-details">
	<form>
		<fieldset class="row" style:justify-content="space-between">
			<label>
				<input type="checkbox" bind:checked={$freeze_camera} />
				<div class="title">freeze_camera</div>
			</label>
			<span
				class="info-icon"
				title="The camera can be freely moved when it's not frozen and nothing is controlled. To pan the camera, use WASD (or the arrow keys) or hold control and drag with the left mouse button."
			>
				🛈
			</span>
		</fieldset>
		<fieldset class="row">
			<label>
				<span class="title">x</span>
				<input type="number" value={x} on:input={update_x} />
				<input type="range" value={x} on:input={update_x} min={0} max={WORLD_SIZE} />
			</label>
			<label>
				<span class="title">y</span>
				<input type="number" value={y} on:input={update_y} />
				<input type="range" value={y} on:input={update_y} min={0} max={WORLD_SIZE} />
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
		<!-- TODO upstream `set_scale` -->
		<!-- <fieldset>
				<label>
					<span class="title">scale</span>
					<input type="number" value={scale} on:input={update_scale} />
					<input type="range" value={scale} on:input={update_scale} min={0} max={10} />
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
