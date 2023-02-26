<script lang="ts">
	import type {Item} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	export let item: Writable<Item>;
	export let item_selection: Writable<Writable<Item> | null>;

	$: selected_item = $item_selection;

	$: console.log(`$selected_item`, $selected_item);

	// TODO BLOCK destroy is bugged, do we need `stage.destroy_item`? or `item.stage`?
</script>

{#if $selected_item}
	<h2>item details</h2>
	<form>
		<div>
			<fieldset>
				<label>
					<div class="title">type</div>
					<select value={$selected_item.type}>
						<option value="circle">circle</option>
						<option value="polygon">polygon</option>
					</select>
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">x</div>
					<input type="x" value={$selected_item.x} />
				</label>
				<label>
					<div class="title">y</div>
					<input type="y" value={$selected_item.y} />
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">id</div>
					<input value={$selected_item.id} />
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineColor</div>
					<input value={$selected_item.graphicsLineColor} />
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineAlpha</div>
					<input
						type="range"
						min={0}
						max={1}
						step={0.01}
						value={$selected_item.graphicsLineAlpha}
					/>
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">text</div>
					<input value={$selected_item.text} />
				</label>
				<label>
					<div class="title">color</div>
					<input type="color" value={$selected_item.color} />
				</label>
			</fieldset>
		</div>
		<button on:click={() => $item.destroy()}>delete {$selected_item.type}</button>
	</form>
{/if}

<style>
	h2 {
		/* TODO refactor, 2 places */
		position: sticky;
		top: 0;
		background-color: var(--bg);
		padding: var(--spacing_xs3) var(--spacing_md);
		font-weight: 300;
		font-size: var(--font_size_md);
		text-align: center;
		text-transform: uppercase;
	}
	fieldset {
		margin-bottom: var(--spacing_md);
	}
</style>
