<script lang="ts">
	import {type Item, hsl_to_string} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	export let item: Item;
	export let selected_item: Writable<Item | null>;
	export let controlled: Writable<Item | null> | undefined = undefined;

	$: ({type, color, tags} = item);
	$: selected = item === $selected_item;
	$: controlling = item === $controlled;
</script>

<li class="item-layer" class:selected>
	<button
		class:selected
		class="deselectable"
		on:click={() => ($selected_item = selected ? null : item)}
		style:--text_color={hsl_to_string(...$color)}
	>
		{#if controlling}
			<!-- TODO improve this -->
			@
		{/if}
		{$type}
		<small>
			{#if $tags}
				{$tags[0]}{#if $tags.length > 1} +{$tags.length - 1}{/if}
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
