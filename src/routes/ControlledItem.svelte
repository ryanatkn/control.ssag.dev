<script lang="ts">
	import {hslToHexString} from '@feltcoop/dealt';

	import type {Stage0} from './stage0';

	export let stage: Stage0;

	$: ({controlled} = stage);

	$: color = $controlled ? $controlled.color : null;
</script>

<div class="item-details">
	{#if $controlled}
		<div class="info" style:--color={$color && hslToHexString(...$color)}>
			{$controlled.$type}
		</div>
	{/if}
	<button on:click={() => ($controlled = null)} disabled={!$controlled}
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
