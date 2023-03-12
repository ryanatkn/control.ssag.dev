<script lang="ts">
	import {type Item, to_layout_x, to_layout_y, to_world_x, to_world_y} from '@feltcoop/dealt';
	import Surface from '@feltjs/felt-ui/Surface.svelte';

	import type {Stage0} from '$routes/stage0';
	import {swallow} from '@feltjs/util';

	export let item: Item;
	export let stage: Stage0;

	$: ({x, y} = item);
	$: ({layout, viewport, camera} = stage);

	$: layout_width = $layout.width;
	$: layout_height = $layout.height;
	$: viewport_width = $viewport.width;
	$: viewport_height = $viewport.height;
	$: camera_width = $camera.width;
	$: camera_height = $camera.height;
	$: camera_x = $camera.x;
	$: camera_y = $camera.y;

	$: console.log(`$x,$y`, $x, $y);
	$: layout_x = to_layout_x($x, layout_width, viewport_width, camera_width, camera_x);
	$: layout_y = to_layout_y($y, layout_height, viewport_height, camera_height, camera_y);

	let dragging = false;

	const mousedown = (e: MouseEvent) => {
		swallow(e);
		pointer_down = true; // kinda hacky, updates the surface because it's not yet mounted
		start_dragging();
	};
	const mouseup = (e: MouseEvent) => {
		swallow(e);
		stop_dragging();
	};

	let pointer_down: boolean | undefined;
	$: if (pointer_down === false) stop_dragging();

	let dragging_x: number | null = null; // world coordinates
	let dragging_y: number | null = null; // world coordinates

	const start_dragging = () => {
		if (dragging) return;
		dragging = true;
		dragging_x = null;
		dragging_y = null;
	};
	const stop_dragging = () => {
		if (!dragging) return;
		dragging = false;
	};

	let pointer_x: number;
	let pointer_y: number;
	$: update_pointer(
		to_world_x(pointer_x, layout_width, viewport_width, camera_width, camera_x),
		to_world_y(pointer_y, layout_height, viewport_height, camera_height, camera_y),
	);
	const update_pointer = (world_x: number, world_y: number) => {
		if (dragging_x === null) {
			dragging_x = world_x;
			dragging_y = world_y;
		} else {
			const dx = world_x - dragging_x;
			const dy = world_y - dragging_y!;
			if (dx || dy) {
				$x += dx;
				$y += dy;
				dragging_x = world_x;
				dragging_y = world_y;
			}
		}
	};
</script>

<div class="item-controls" style:transform="translate3d({layout_x}px, {layout_y}px, 0)">
	<div class="handle" class:dragging on:mousedown={mousedown} on:mouseup={mouseup} />
</div>
{#if dragging}
	<div class="surface-wrapper">
		<Surface bind:pointerDown={pointer_down} bind:pointerX={pointer_x} bind:pointerY={pointer_y} />
	</div>
{/if}

<style>
	.item-controls {
		position: absolute;
		left: 0;
		top: 0;
	}

	.handle {
		position: relative;
		left: calc(var(--input_height) / -2);
		top: calc(var(--input_height) / -2);
		width: var(--input_height);
		height: var(--input_height);
		border-radius: 50%;
		border: 4px double var(--tint_light_4);
		box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.4);
	}
	.handle:hover {
		border-color: var(--tint_light_5);
	}
	.handle.dragging {
		border-color: var(--tint_light_6);
		box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.4) inset;
	}

	.surface-wrapper {
		position: absolute;
		inset: 0;
	}
</style>
