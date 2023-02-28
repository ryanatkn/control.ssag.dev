<script lang="ts">
	import {type Item, hexToRgb} from '@feltcoop/dealt';
	import type {Stage0} from './stage0';

	export let item: Item;
	export let stage: Stage0;

	$: ({controlled} = stage);

	$: controlling = item === $controlled;

	$: ({
		type,
		points,
		radius,
		x,
		y,
		scale_x,
		scale_y,
		id,
		graphicsLineColor,
		graphicsLineAlpha,
		text,
		color,
	} = item);

	// TODO BLOCK destroy is bugged, do we need `stage.destroy_item`? or `item.stage`?
</script>

<div class="item-details">
	<h2 class="pane-title">item details</h2>
	<form>
		<div>
			<fieldset class="row">
				<label>
					<div class="title">type</div>
					<select bind:value={$type}>
						<option value="circle">circle</option>
						<option value="polygon">polygon</option>
					</select>
				</label>
				<label>
					{#if $type === 'polygon'}
						<div class="title">points</div>
						<input value={JSON.stringify($points)} />
					{:else if $type === 'circle'}
						<div class="title">radius</div>
						<input type="number" bind:value={$radius} />
					{:else}
						TODO handle type {$type}
					{/if}
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">x</div>
					<input type="number" bind:value={$x} />
				</label>
				<label>
					<div class="title">y</div>
					<input type="number" bind:value={$y} />
				</label>
			</fieldset>
			{#if controlled !== undefined}
				<fieldset>
					<label class="row" on:input={() => stage.swapControl(controlling ? null : item)}>
						<input type="checkbox" checked={controlling} />
						<div class="title">controlling</div>
					</label>
				</fieldset>
			{/if}
			{#if $type === 'polygon'}
				<fieldset class="row">
					<label>
						<div class="title">scale_x</div>
						<input type="number" bind:value={$scale_x} />
					</label>
					<label>
						<div class="title">scale_y</div>
						<input type="number" bind:value={$scale_y} />
					</label>
				</fieldset>
			{/if}
			<fieldset>
				<label>
					<div class="title">id</div>
					<!-- TODO enable editing -->
					<input value={id} disabled={true} />
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineColor</div>
					<!-- TODO how to bind value? -->
					<input type="color" value={$graphicsLineColor && hexToRgb($graphicsLineColor)} />
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineAlpha</div>
					<input type="range" min={0} max={1} step={0.01} bind:value={$graphicsLineAlpha} />
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">text</div>
					<input bind:value={$text} />
				</label>
				<label>
					<div class="title">color</div>
					<input type="color" bind:value={$color} />
				</label>
			</fieldset>
		</div>
	</form>
	<button class="flush" on:click={() => item.destroy()}>destroy {$type}</button>
</div>

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
