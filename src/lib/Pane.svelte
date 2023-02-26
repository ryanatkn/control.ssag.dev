<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {getLayout, type Item} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';

	//
	export let items: Item[];
	export let selected_item: Writable<Item>;
	export let width = 256; // TODO BLOCK

	const layout = getLayout();

	let dragging = false;
	let offset_x = $layout.width - width;
	let offset_y = 0;
	$: offset_x_clamped = Math.max(0, Math.min(offset_x, $layout.width));
	$: offset_y_clamped = Math.max(0, Math.min(offset_y, $layout.height));
	let current_x: number | null = null;
	let current_y: number | null = null;
	let last_x: number | null = null;
	let last_y: number | null = null;
	const start_dragging = (
		e: PointerEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		},
	) => {
		swallow(e);
		dragging = true;
		last_x = null;
		last_y = null;
		current_x = e.clientX;
		current_y = e.clientY;
	};
	const stop_dragging = () => {
		dragging = false;
		current_x = null;
		current_y = null;
		last_x = null;
		last_y = null;
	};
	const dragTo = (x_target: number, y_target: number): void => {
		last_x = current_x;
		current_x = x_target;
		last_y = current_y;
		current_y = y_target;
		if (last_x !== null && current_x !== null) offset_x += current_x - last_x;
		if (last_y !== null && current_y !== null) offset_y += current_y - last_y;
	};
	const dragBy = (dx: number, dy: number): void => {
		if (current_x !== null) current_x += dx;
		if (current_y !== null) current_y += dy;
	};
</script>

<!-- TODO draggable action -->
<div
	class="pane"
	on:pointerdown={start_dragging}
	on:pointerup={stop_dragging}
	on:pointermove={dragging
		? (e) => {
				// TODO need to draw a surface behind the pane that fullscreens to capture events
				swallow(e);
				dragTo(e.clientX, e.clientY);
		  }
		: undefined}
	on:pointercancel={stop_dragging}
	style:--width="{width}px"
	style:--offset_x="{offset_x_clamped}px"
	style:--offset_y="{offset_y_clamped}px"
>
	{#each items as item (item)}
		{@const selected = item === $selected_item}
		<li class:selected class="buttonlike">
			<slot {item} {selected} />
		</li>
	{/each}
</div>

<style>
	.pane {
		--pane_width: var(--width, var(--column_width_sm));
		position: absolute;
		left: 0;
		top: 0;
		width: var(--pane_width);
		transform: translate3d(var(--offset_x, 0), var(--offset_y, 0), var(--offset_z, 0));
	}
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing_sm) var(--spacing_lg);
	}
</style>
