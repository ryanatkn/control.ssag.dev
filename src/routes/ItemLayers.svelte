<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import ItemLayer from '$routes/ItemLayer.svelte';

	export let items: Array<Writable<Item>> | undefined;
	export let item_selection: Writable<Writable<Item> | null>;
</script>

<div class="items">
	<h2>items</h2>
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

	h2 {
		/* TODO refactor, 2 places */
		position: sticky;
		top: 0;
		background-color: var(--bg);
		padding: 0 var(--spacing_md);
		font-weight: 200;
		font-size: var(--font_size_md);
		text-align: center;
		text-transform: uppercase;
	}

	ol {
		overflow: auto;
		flex: 1;
	}
</style>
