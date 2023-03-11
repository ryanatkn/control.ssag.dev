<script lang="ts">
	import {hsl_to_hex_string, Item} from '@feltcoop/dealt';

	import type {Stage0} from '$routes/stage0';

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
		if (!item) return;
		last_controlled = last_controlled_temp;
		last_controlled_temp = item;
	};

	$: selected_is_controlled = !!selected && selected === $controlled;
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
		<button on:click={() => stage.swap_control(null, true)} disabled={!$controlled}>
			release control
		</button>
		<button
			disabled={!selected || selected_is_controlled}
			on:click={selected && !selected_is_controlled
				? () => stage.swap_control(selected, true)
				: undefined}
		>
			swap to selected
		</button>
		<button
			disabled={!last_controlled}
			on:click={last_controlled ? () => stage.swap_control(last_controlled, true) : undefined}
		>
			swap back
		</button>
	</div>
</div>

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
