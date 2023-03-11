<script lang="ts">
	import {
		type Item,
		hexToRgb,
		hexStringToRgb,
		rgbToHex,
		rgbToHexString,
		hexStringToHsl,
		hslToHexString,
	} from '@feltcoop/dealt';
	import {handleTargetValue} from '@feltjs/util/dom.js';

	import type {Stage0} from './stage0';

	export let item: Item;
	export let stage: Stage0;

	const GRAPHICS_LINE_WIDTH_MAX = 4;

	$: ({controlled} = stage);

	$: controlling = item === $controlled;

	$: ({
		type,
		id,
		speed,
		strength,
		ghostly,
		invisible,
		x,
		y,
		radius,
		points,
		tags,
		scale_x,
		scale_y,
		graphicsLineWidth,
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

	let points_raw = JSON.stringify(item.$points);
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
						<input
							value={points_raw}
							on:input={handleTargetValue((value) => {
								points_raw = value;
								try {
									$points = JSON.parse(value);
								} catch (err) {
									// TODO probably show its state as unsaved instead of ignoring altogether (.error class?)
								}
							})}
						/>
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
					<div class="title">controlling</div>
					<input
						type="checkbox"
						checked={controlling}
						on:input={(e) => stage.swapControl(e.currentTarget.checked ? item : null, true)}
					/>
				</label>
				<label>
					<div class="title">color</div>
					<input
						type="color"
						value={hslToHexString(...$color)}
						on:input={handleTargetValue((value) => {
							$color = hexStringToHsl(value);
						})}
					/>
				</label>
			</fieldset>
			<fieldset class="row">
				<label>
					<div class="title">ghostly</div>
					<input type="checkbox" bind:checked={$ghostly} />
				</label>
				<label>
					<div class="title">invisible</div>
					<input type="checkbox" bind:checked={$invisible} />
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
			<fieldset class="row">
				<label>
					<div class="title">speed</div>
					<input type="number" bind:value={$speed} step={0.05} />
				</label>
				<label>
					<div class="title">strength</div>
					<input type="number" bind:value={$strength} />
				</label>
			</fieldset>
			<fieldset class="centered">
				<div class="title">tags</div>
				<input
					value={$tags ? $tags.join(', ') : ''}
					disabled={true}
					title="TODO enable editing this"
				/>
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
			<fieldset>
				<label>
					<div class="title">graphicsLineWidth</div>
					<div class="row">
						<input
							type="range"
							min={0}
							max={GRAPHICS_LINE_WIDTH_MAX}
							step={1}
							bind:value={$graphicsLineWidth}
						/>
						<input
							type="number"
							min={0}
							max={GRAPHICS_LINE_WIDTH_MAX}
							step={1}
							bind:value={$graphicsLineWidth}
						/>
					</div>
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineColor</div>
					<input
						type="color"
						value={rgbToHexString(...hexToRgb($graphicsLineColor))}
						on:input={handleTargetValue((value) => {
							$graphicsLineColor = rgbToHex(...hexStringToRgb(value));
						})}
					/>
				</label>
			</fieldset>
			<fieldset>
				<label>
					<div class="title">graphicsLineAlpha</div>
					<input type="range" min={0} max={1} step={0.01} bind:value={$graphicsLineAlpha} />
				</label>
			</fieldset>
		</div>
		<fieldset>
			<label>
				<div class="title">id</div>
				<!-- TODO enable editing -->
				<input value={id} disabled={true} />
			</label>
		</fieldset>
	</form>
	<button on:click={() => stage.removeItem(item)}>destroy {$type}</button>
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
