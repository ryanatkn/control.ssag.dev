<script lang="ts">
	import {hslToHexString} from '@feltcoop/dealt';

	import type {Stage0} from './stage0';

	export let stage: Stage0;

	$: ({controlled} = stage);

	// these type assertions aren't great, but they're better than markup guards that just make the typechecker happy
	$: type = $controlled ? $controlled.type : null!;
	$: color = $controlled ? $controlled.color : null!;
	$: x = $controlled ? $controlled.x : null!;
	$: y = $controlled ? $controlled.y : null!;
</script>

<div class="item-details">
	{#if $controlled}
		<div class="info" style:--color={$color && hslToHexString(...$color)}>
			{$type}
			<span>
				({Math.round($x)}, {Math.round($y)})
			</span>
		</div>
	{/if}
	<button on:click={() => stage.swapControl(null, true)} disabled={!$controlled}
		>{#if $controlled}release control{:else}no item is controlled{/if}</button
	>
</div>

<style>
	.item-details {
		display: flex;
		flex-direction: column;
	}
	.info {
		font-weight: bold;
		color: var(--color);
		padding: var(--spacing_md);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
