<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import {toHslCss} from '$lib/util';

	export let item: Writable<Item>;
	export let item_selection: Writable<Writable<Item> | null>;

	$: selected = item === $item_selection;
</script>

<li class="item" class:selected>
	<button
		class:selected
		on:click={() => ($item_selection = item)}
		style:--text_color={toHslCss($item.color)}
	>
		{#if selected}
			⇒
		{/if}
		{$item.type} <small>{$item.id.slice(0, 3)}..{$item.id.slice(-3)}</small>
	</button>
</li>

<style>
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item button {
		width: 100%;
		justify-content: space-between;
		--border_radius: 0;
		--input_height: var(--input_height_sm);
		padding: 0 var(--spacing_md);
	}
</style>
