<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import {
		World,
		setViewport,
		SurfaceWithController,
		getPixi,
		createCamera,
		getLayout,
		Stage,
		type ExitStage,
		type Item,
	} from '@feltcoop/dealt';

	import {Stage0} from '$routes/stage0';
	import Pane from '$lib/Pane.svelte';
	import {WORLD_SIZE} from './constants';

	export let pixi = getPixi();
	export let layout = getLayout();

	import type {Writable} from 'svelte/store';

	// TODO BLOCK implement:
	// TODO BLOCK show all items in a list
	// TODO BLOCK item selection
	// TODO BLOCK draggable/resizable pane component
	// TODO contextmenu to enable dragging on windows

	// TODO BLOCK
	type SceneMode = 'playing' | 'editing';
	let mode: SceneMode = 'editing';

	let viewportSize = Math.min($layout.width, $layout.height);
	$: viewportSize = Math.min($layout.width, $layout.height);

	// Scenes control the `viewport` and `camera`.
	const viewport = setViewport(writable({width: viewportSize, height: viewportSize}));
	$: viewport.set({width: viewportSize, height: viewportSize});
	const camera = createCamera();
	$: camera.setDimensions(WORLD_SIZE, WORLD_SIZE, $viewport.width, $viewport.height);

	let stage: Stage | undefined | null;
	let setting_up: boolean | undefined;

	let items: Item[] | undefined;
	const item_selection: Writable<Writable<Item> | null> = writable(null);
	$: selected_item = $item_selection;

	const exit: ExitStage = (outcome) => {
		console.log(`exit outcome`, outcome);
		create_stage();
	};

	const create_stage = () => {
		if (setting_up) return;
		setting_up = true;
		if (stage) destroy_stage();
		stage = new Stage0({exit, camera, viewport, layout});
		void stage.setup({stageStates: []});
		items = Array.from(stage.itemById.values()); // TODO BLOCK
		$item_selection = writable(items[0]); // TODO BLOCK make reactive
		setting_up = false;
	};

	onMount(() => {
		create_stage();
	});

	// TODO abstract this
	const destroy_stage = () => {
		if (!stage) return;
		console.log(`destroying stage`, stage);
		stage.destroy();
		stage = null;
	};
	onDestroy(destroy_stage);
</script>

{#if stage}
	{#key stage}
		<World {stage} {pixi} />
		<SurfaceWithController controller={stage.controller} />
		{#if mode === 'editing'}
			<Pane>
				{#if items}
					{#each items as item (item)}
						{@const selected = item === $selected_item}
						<li
							class="item buttonlike"
							class:selected
							style:--color="hsl({item.color[0]}deg, {item.color[1] * 100}%, {item.color[2] *
								100}%)"
						>
							{item.type} <small>{item.id.slice(0, 3)}..{item.id.slice(-3)}</small>
							{#if selected}
								selected
							{/if}
						</li>
					{/each}
				{/if}
				<button on:click={() => alert('TODO')}>create item</button>
				<!-- TODO text-overflow -->
			</Pane>
		{/if}
	{/key}
{/if}

<style>
	.item {
		color: var(--color);
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing_sm) var(--spacing_lg);
	}
</style>
