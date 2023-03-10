<script lang="ts">
	import {hslToHexString, Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0;
	export let item_selection: Writable<Item | null>;

	$: ({controlled} = stage);

	// these type assertions aren't great, but they're better than markup guards that just make the typechecker happy
	$: type = $controlled ? $controlled.type : null!;
	$: color = $controlled ? $controlled.color : null!;
	$: x = $controlled ? $controlled.x : null!;
	$: y = $controlled ? $controlled.y : null!;

	// TODO abstract all of this with a custom store?
	let last_controlled: Item | null; // technically `| undefined` but makes it harder to use in markup
	let last_controlled_temp: Item | null;
	$: update_controlled($controlled);
	const update_controlled = (item: Item | null) => {
		last_controlled = last_controlled_temp;
		last_controlled_temp = item;
	};

	$: selected_is_controlled = !!$item_selection && $item_selection === $controlled;
</script>

<div class="item-details">
	<div class="info" style:--color={$controlled ? $color && hslToHexString(...$color) : null}>
		{#if $controlled}
			{$type}
			<span>
				({Math.round($x)}, {Math.round($y)})
			</span>
		{:else}
			no item is controlled
		{/if}
	</div>
	<button on:click={() => stage.swapControl(null, true)} disabled={!$controlled}
		>release control</button
	>
	<div class="row">
		<button
			disabled={!$item_selection || selected_is_controlled}
			on:click={$item_selection && !selected_is_controlled
				? () => stage.swapControl($item_selection, true)
				: undefined}
		>
			swap to selected
		</button>
		<button
			disabled={!last_controlled}
			on:click={last_controlled ? () => stage.swapControl(last_controlled, true) : undefined}
		>
			swap to last
		</button>
	</div>
</div>

<style>
	.item-details {
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
</style>
