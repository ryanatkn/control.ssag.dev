<script lang="ts">
	import {type Item, hslToStr} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	export let item: Item;
	export let item_selection: Writable<Item | null>;
	export let controlled: Writable<Item | null> | undefined = undefined;

	$: ({type, color} = item);
	$: tags = item.tags && Array.from(item.tags);
	$: selected = item === $item_selection;
	$: controlling = item === $controlled;
</script>

<li class="item-layer" class:selected>
	<button
		class:selected
		on:click={() => ($item_selection = item)}
		style:--text_color={hslToStr(...$color)}
	>
		{#if controlling}
			<!-- TODO improve this -->
			@
		{/if}
		{#if selected}
			⇒
		{/if}
		{$type}
		<small>
			{#if tags}
				{tags[0]}{#if tags.length > 1} +{tags.length - 1}{/if}
			{:else}
				{item.id.slice(0, 3)}..{item.id.slice(-3)}
			{/if}
		</small>
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
