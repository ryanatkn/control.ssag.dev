<script lang="ts">
	import {type Item, hexToRgb} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';

	export let item: Writable<Item>;
	export let item_selection: Writable<Writable<Item> | null>;

	$: selected_item = $item_selection;

	// TODO BLOCK destroy is bugged, do we need `stage.destroy_item`? or `item.stage`?
</script>

{#if $selected_item}
	<div class="item-details">
		<h2 class="pane-title">item details</h2>
		<form>
			<div>
				<fieldset class="row">
					<label>
						<div class="title">type</div>
						<select value={$selected_item.type}>
							<option value="circle">circle</option>
							<option value="polygon">polygon</option>
						</select>
					</label>
					<label>
						{#if $selected_item.type === 'polygon'}
							<div class="title">points</div>
							<input value={JSON.stringify($selected_item.points)} />
						{:else if $selected_item.type === 'circle'}
							<div class="title">radius</div>
							<input type="number" value={$selected_item.radius} />
						{:else}
							TODO handle type {$selected_item.type}
						{/if}
					</label>
				</fieldset>
				<fieldset class="row">
					<label>
						<div class="title">x</div>
						<input type="number" value={$selected_item.x} />
					</label>
					<label>
						<div class="title">y</div>
						<input type="number" value={$selected_item.y} />
					</label>
				</fieldset>
				{#if $selected_item.type === 'polygon'}
					<fieldset class="row">
						<label>
							<div class="title">scale_x</div>
							<input type="number" value={JSON.stringify($selected_item.scale_x)} />
						</label>
						<label>
							<div class="title">scale_y</div>
							<input type="number" value={JSON.stringify($selected_item.scale_y)} />
						</label>
					</fieldset>
				{/if}
				<fieldset>
					<label>
						<div class="title">id</div>
						<input value={$selected_item.id} />
					</label>
				</fieldset>
				<fieldset>
					<label>
						<div class="title">graphicsLineColor</div>
						<input
							type="color"
							value={$selected_item.graphicsLineColor && hexToRgb($selected_item.graphicsLineColor)}
						/>
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
		</form>
		<button class="flush" on:click={() => $item.destroy()}>delete {$selected_item.type}</button>
	</div>
{/if}

<style>
	.item-details {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	form {
		overflow: auto;
		flex: 1;
	}

	fieldset {
		margin-bottom: var(--spacing_md);
	}

	fieldset.row > label {
		flex: 1;
	}
</style>
