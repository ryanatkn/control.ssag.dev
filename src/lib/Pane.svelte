<script lang="ts">
	import {enableGlobalHotkeys, getLayout} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';

	const layout = getLayout();

	export let width = 256;
	export let height = 256;
	export let offset_x = 0;
	export let offset_y = 0;

	// TODO set z-index based on most recently clicked

	let dragging = false;
	$: offset_x_clamped = Math.max(0, Math.min(offset_x, $layout.width - width));
	$: offset_y_clamped = Math.max(0, Math.min(offset_y, $layout.height - height));
	let current_x: number | null = null;
	let current_y: number | null = null;
	let last_x: number | null = null;
	let last_y: number | null = null;
	const start_dragging = (
		e: PointerEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		},
	) => {
		// TODO this is hacky, maybe extract? `enableGlobalPointer`?
		const target = e.target as Element;
		const {tagName} = target;
		if (
			!enableGlobalHotkeys(target) ||
			tagName === 'INPUT' ||
			tagName === 'BUTTON' ||
			tagName === 'LABEL' ||
			target.parentElement?.tagName === 'LABEL'
		) {
			return;
		}
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
	// const dragBy = (dx: number, dy: number): void => {
	// 	if (current_x !== null) current_x += dx;
	// 	if (current_y !== null) current_y += dy;
	// };

	let toggled = true;
	const toggle = (): void => {
		toggled = !toggled;
	};

	$: finalHeight = toggled ? height + 'px' : 'var(--input_height_sm)';
</script>

<!-- TODO draggable action? or higher order component? -->
<div
	class="pane"
	class:dragging
	on:pointerdown={start_dragging}
	on:pointercancel={stop_dragging}
	style:--width="{width}px"
	style:--height={finalHeight}
	style:--offset_x="{offset_x_clamped}px"
	style:--offset_y="{offset_y_clamped}px"
>
	<h2>
		<button class="plain-button" on:click={toggle}>
			<slot name="header" />
		</button>
	</h2>
	{#if toggled}
		<slot />
	{/if}
</div>
<!-- TODO use `Surface`? -->
{#if dragging}
	<div
		class="surface"
		on:pointermove={(e) => {
			swallow(e);
			dragTo(e.clientX, e.clientY);
		}}
		on:pointerup={stop_dragging}
	/>
{/if}

<style>
	.pane {
		z-index: 1;
		--pane_width: var(--width, var(--column_width_sm));
		--pane_height: var(--height, var(--pane_width));
		position: absolute;
		left: 0;
		top: 0;
		width: var(--pane_width);
		height: var(--pane_height);
		transform: translate3d(var(--offset_x, 0), var(--offset_y, 0), var(--offset_z, 0));
		overflow: auto;
		cursor: move;
		border-radius: 0;
		outline: var(--border_width) var(--border_style) var(--shadow_border_color);
		opacity: 0.83;
	}
	.pane:hover,
	.pane:focus-within {
		opacity: unset;
	}
	h2 {
		position: sticky;
		top: 0;
		background-color: var(--bg);
		display: flex;
		justify-content: center;
	}
	h2 button {
		font-size: var(--font_size_sm);
		text-transform: uppercase;
		--input_height: var(--input_height_sm);
	}
	.dragging {
		outline-width: var(--border_width_3);
	}
	.surface {
		z-index: 2;
		position: fixed;
		inset: 0;
	}
</style>
