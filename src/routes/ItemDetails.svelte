<script lang="ts">
	import {type Item, hexToRgb} from '@feltcoop/dealt';
	import type {Stage0} from './stage0';

	export let item: Item;
	export let stage: Stage0;

	$: ({controlled} = stage);

	$: controlling = item === $controlled;

	$: ({
		type,
		id,
		speed,
		strength,
		x,
		y,
		radius,
		points,
		scale_x,
		scale_y,
		graphicsLineColor,
		graphicsLineAlpha,
		text,
		textFill,
		fontSize,
		fontFamily,
		textOffsetX,
		textOffsetY,
		color,
	} = item);

	// TODO BLOCK destroy is bugged, do we need `stage.destroy_item`? or `item.stage`?
</script>

<div class="item-details">
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
					<div class="title">speed</div>
					<input type="number" bind:value={$speed} />
				</label>
				<label>
					<div class="title">strength</div>
					<input type="number" bind:value={$strength} />
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
					<div class="title">textFill</div>
					<input type="color" bind:value={$textFill} />
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">fontSize</div>
					<input type="number" bind:value={$fontSize} />
				</label>
				<label>
					<div class="title">fontFamily</div>
					<input bind:value={$fontFamily} />
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">textOffsetX</div>
					<input type="number" bind:value={$textOffsetX} />
				</label>
				<label>
					<div class="title">textOffsetY</div>
					<input type="number" bind:value={$textOffsetY} />
				</label>
			</fieldset>
			<fieldset class="row">
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
		display: flex;
		flex-direction: column;
	}

	form {
		flex: 1;
	}

	fieldset {
		margin-bottom: var(--spacing_md);
	}

	fieldset.row > label {
		flex: 1;
	}
</style>
