<script lang="ts">
	import {type Item, to_layout_x, to_layout_y} from '@feltcoop/dealt';

	import type {Stage0} from '$routes/stage0';

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
</script>

<div class="item-controls" style:transform="translate3d({layout_x}px, {layout_y}px, 0)">
	<!-- TODO handles to set item.x/y -->
	TODO ADD HANDLES
</div>

<style>
	.item-controls {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
