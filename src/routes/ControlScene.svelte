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
	import type {Writable} from 'svelte/store';

	import {Stage0} from '$routes/stage0';
	import Pane from '$lib/Pane.svelte';
	import {WORLD_SIZE} from '$routes/constants';
	import ItemLayers from '$routes/ItemLayers.svelte';
	import ItemDetails from './ItemDetails.svelte';

	export let pixi = getPixi();
	export let layout = getLayout();

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

	let items: Array<Writable<Item>> | undefined;
	const item_selection: Writable<Writable<Item> | null> = writable(null);

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
		items = Array.from(stage.itemById.values(), (v) => writable(v)); // TODO BLOCK
		$item_selection = items[0]; // TODO BLOCK make reactive
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

	const pane_width = 256; // TODO
	const pane_height = 256; // TODO
	const pane_heigth_lg = 384; // TODO
</script>

{#if stage}
	{#key stage}
		<World {stage} {pixi} />
		<SurfaceWithController controller={stage.controller} />
		{#if mode === 'editing'}
			<Pane>
				<ItemLayers {items} {item_selection} />
			</Pane>
			<Pane width={pane_width} height={pane_heigth_lg} offset_y={$layout.height - pane_height}>
				{#if $item_selection}
					<ItemDetails item={$item_selection} {item_selection} />
				{/if}
				<!-- TODO text-overflow -->
			</Pane>
		{/if}
	{/key}
{/if}
