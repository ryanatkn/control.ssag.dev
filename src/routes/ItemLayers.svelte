<script lang="ts">
	import {Item, type ItemData} from '@feltcoop/dealt';
	import {omit} from '@feltjs/util/object.js';
	import type {Writable} from 'svelte/store';

	import ItemLayer from '$routes/ItemLayer.svelte';
	import type {Stage0} from '$routes/stage0';

	export let stage: Stage0;
	export let items: Writable<Item[]> | undefined;
	export let selected_item: Writable<Item | null>;

	$: ({controlled} = stage);

	// TODO is janky --s for this initial data, what would be better than this for users?
	const to_initial_item_data = (item: Item | null): ItemData | null => {
		if (!item) return null;
		const data = item.to_data();
		if (!data) return null;
		const d = omit(data as any, ['id']) as any;
		if ('x' in d) d.x += 20;
		if ('y' in d) d.y += 20;
		return d;
	};

	const create = (): void => {
		const item = new Item(stage.collisions, to_initial_item_data($selected_item));
		stage.add_item(item);
		$selected_item = item;
	};
</script>

<div class="item-layers">
	{#if $items && $items.length > 5}
		<button on:click={create}>create item</button>
	{/if}
	<ol>
		{#if $items}
			{#each $items as item (item)}
				<ItemLayer {item} {selected_item} {controlled} />
			{/each}
		{/if}
	</ol>
	<button on:click={create}>create item</button>
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
