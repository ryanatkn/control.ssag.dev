<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import ItemLayer from '$routes/ItemLayer.svelte';

	export let items: Array<Writable<Item>> | undefined;
	export let item_selection: Writable<Writable<Item> | null>;
</script>

<div class="items">
	<ol>
		{#if items}
			{#each items as item (item)}
				<ItemLayer {item} {item_selection} />
			{/each}
		{/if}
	</ol>
	<button on:click={() => alert('TODO')}>create item</button>
</div>

<style>
	.items {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	ol {
		overflow: auto;
		flex: 1;
	}
</style>
