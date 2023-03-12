<script lang="ts">
	import type {Item} from '@feltcoop/dealt';

	export let item: Item;
	export let to_layout_x: (world_x: number) => number;
	export let to_layout_y: (world_y: number) => number;

	$: ({x, y} = item);

	$: console.log(`$x,$y`, $x, $y);
	$: layout_x = to_layout_x($x);
	$: layout_y = to_layout_y($y);
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
