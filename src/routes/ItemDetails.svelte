<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	import {toHslCss} from '$lib/util';

	export let item: Writable<Item>;
	export let item_selection: Writable<Writable<Item> | null>;

	$: selected_item = $item_selection;

	// TODO BLOCK destroy is bugged, do we need `stage.destroy_item`? or `item.stage`?
</script>

{#if $selected_item}
	<div>
		<label style:--text_color={toHslCss($item.color)}>
			<div class="title">type</div>
			<select value={$selected_item.type}>
				<option value="circle">circle</option>
				<option value="polygon">polygon</option>
			</select>
		</label>
		<label>
			<div class="title">id</div>
			<input value={$selected_item.id} />
		</label>
		<label>
			<div class="title">text</div>
			<input value={$selected_item.text} /> (TODO bind me)
		</label>
	</div>
	<button on:click={() => $item.destroy()}>delete {$selected_item.type}</button>
{/if}
