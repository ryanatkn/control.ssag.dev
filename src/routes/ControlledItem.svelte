<script lang="ts">
	import {hsl_to_hex_string, Item} from '@feltcoop/dealt';

	import type {Stage0} from '$routes/stage0';
	import Hotkeys from '$lib/Hotkeys.svelte';

	export let stage: Stage0;
	export let selected: Item | null;

	$: ({controlled} = stage);

	// these type assertions aren't great, but they're better than markup guards that just make the typechecker happy
	$: type = $controlled ? $controlled.type : null!;
	$: color = $controlled ? $controlled.color : null!;
	$: x = $controlled ? $controlled.x : null!;
	$: y = $controlled ? $controlled.y : null!;

	// TODO abstract all of this with a custom store?
	let last_controlled: Item | null = null;
	let last_controlled_temp: Item | null = null;
	$: update_last_controlled($controlled);
	const update_last_controlled = (item: Item | null) => {
		if (item) {
			if (item !== last_controlled_temp) {
				last_controlled = last_controlled_temp || item;
				last_controlled_temp = item;
			}
		}
		// TODO polish this, ideally it'd swap back to the last active one, but this causes other problems
		// else {
		// 	const l = last_controlled;
		// 	last_controlled = last_controlled_temp;
		// 	last_controlled_temp = l;
		// }
	};

	$: selected_is_controlled = !!selected && selected === $controlled;

	$: controlled_type = $controlled?.type;
	$: controlled_name = $controlled_type || 'item';

	$: enable_release_control = !!$controlled;
	$: enable_control_selected = !!selected && !selected_is_controlled;
	$: enable_swap_back = !!last_controlled && last_controlled !== $controlled;

	const release_control = (): void => {
		if (enable_release_control) stage.swap_control(null, true);
	};
	const control_selected = (): void => {
		if (enable_control_selected) stage.swap_control(selected, true);
	};
	const swap_back = (): void => {
		if (enable_swap_back) stage.swap_control(last_controlled, true);
	};
</script>

<div class="controlled-item">
	<div class="info" style:--color={$controlled ? $color && hsl_to_hex_string(...$color) : null}>
		{#if $controlled}
			{$type}
			<span>
				({Math.round($x)}, {Math.round($y)})
			</span>
		{:else}
			no item is controlled
		{/if}
	</div>
	<div>
		<button
			on:click={release_control}
			disabled={!enable_release_control}
			title="release control of this {controlled_name} [1]"
		>
			release control
		</button>
		<button
			disabled={!enable_control_selected}
			on:click={control_selected}
			title="control this {controlled_name} [2]"
		>
			control selected
		</button>
		<button
			disabled={!enable_swap_back}
			on:click={swap_back}
			title="swap control back to the previous item [3]"
		>
			swap back
		</button>
	</div>
</div>
<Hotkeys
	hotkeys={[
		{match: '1', action: release_control},
		{match: '2', action: control_selected},
		{match: '3', action: swap_back},
	]}
/>

<style>
	.controlled-item {
		display: flex;
		flex-direction: column;
	}
	.info {
		font-weight: bold;
		color: var(--color);
		padding: var(--spacing_md);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	button {
		width: 100%;
	}
</style>
