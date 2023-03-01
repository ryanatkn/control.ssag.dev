<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import ItemLayer from '$routes/ItemLayer.svelte';
	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0;
	export let items: Writable<Item[]> | undefined;
	export let item_selection: Writable<Item | null>;

	$: ({controlled} = stage);

	const create = () => {};
</script>

<div class="item-layers">
	{#if $items && $items.length > 5}
		<button class="flush" on:click={create}>create item</button>
	{/if}
	<ol>
		{#if $items}
			{#each $items as item (item)}
				<ItemLayer {item} {item_selection} {controlled} />
			{/each}
		{/if}
	</ol>
	<button class="flush" on:click={create}>create item</button>
</div>

<style>
	.item-layers {
		display: flex;
		flex-direction: column;
	}

	ol {
		flex: 1;
	}
</style>
