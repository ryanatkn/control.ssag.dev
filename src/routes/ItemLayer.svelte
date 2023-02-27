<script lang="ts">
	import {type Item, hslToStr} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	export let item: Writable<Item>;
	export let item_selection: Writable<Writable<Item> | null>;

	$: selected = item === $item_selection;
</script>

<li class="item-layer" class:selected>
	<button
		class:selected
		on:click={() => ($item_selection = item)}
		style:--text_color={hslToStr(...$item.color)}
	>
		{#if selected}
			⇒
		{/if}
		{$item.type} <small>{$item.id.slice(0, 3)}..{$item.id.slice(-3)}</small>
	</button>
</li>

<style>
	.item-layer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-layer button {
		width: 100%;
		justify-content: space-between;
		--border_radius: 0;
		--input_height: var(--input_height_sm);
		padding: 0 var(--spacing_md);
	}
</style>
