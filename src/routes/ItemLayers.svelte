<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import ItemLayer from '$routes/ItemLayer.svelte';

	export let items: Writable<Item[]> | undefined;
	export let item_selection: Writable<Item | null>;
	export let controlled: Writable<Item | null> | undefined = undefined;
</script>

<div class="item-layers">
	<ol>
		{#if $items}
			{#each $items as item (item)}
				<ItemLayer {item} {item_selection} {controlled} />
			{/each}
		{/if}
	</ol>
	<button class="flush" on:click={() => alert('TODO')}>create item</button>
</div>

<style>
	.item-layers {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	ol {
		overflow: auto;
		flex: 1;
	}
</style>
