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
	} from '@feltcoop/dealt';

	import {Stage0} from '$routes/stage0';
	import Pane from '$lib/Pane.svelte';
	import {WORLD_SIZE} from './constants';

	export let pixi = getPixi();
	export let layout = getLayout();

	import type {Writable} from 'svelte/store';
	import type {Item} from '@feltcoop/dealt';

	// TODO BLOCK implement:
	// TODO BLOCK show all entities in a list
	// TODO BLOCK entity selection
	// TODO BLOCK draggable/resizable pane component
	// TODO contextmenu to enable dragging on windows

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
		items = Array.from(stage.entityById.values()); // TODO BLOCK
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
		<Pane {items} selected_item={$item_selection} let:item>
			<!-- TODO text-overflow -->
			<div class="ellipsis">
				{item.type} <small>{item.id.slice(0, 3)}..{item.id.slice(-3)}</small>
			</div>
		</Pane>
	{/key}
{/if}
