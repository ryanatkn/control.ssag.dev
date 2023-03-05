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
		type ExitStage,
		type Item,
		enableGlobalHotkeys,
	} from '@feltcoop/dealt';
	import type {Writable} from 'svelte/store';
	import {swallow} from '@feltjs/util/dom.js';
	import {dev} from '$app/environment';

	import {Stage0} from '$routes/stage0';
	import Pane from '$lib/Pane.svelte';
	import {WORLD_SIZE} from '$routes/constants';
	import ItemLayers from '$routes/ItemLayers.svelte';
	import ItemDetails from '$routes/ItemDetails.svelte';
	import SceneDetails from '$routes/SceneDetails.svelte';
	import Hotkeys from '$lib/Hotkeys.svelte';

	export let pixi = getPixi();
	export let layout = getLayout();

	// TODO resizable pane component
	// TODO contextmenu to enable dragging on windows

	// TODO where does this belong?
	type SceneMode = 'playing' | 'editing';
	let mode: SceneMode = dev ? 'editing' : 'playing';

	const toggleEditMode = (enable = mode !== 'editing'): void => {
		mode = enable ? 'editing' : 'playing';
	};

	let viewportSize = Math.min($layout.width, $layout.height);
	$: viewportSize = Math.min($layout.width, $layout.height);

	// Scenes control the `viewport` and `camera`.
	const viewport = setViewport(writable({width: viewportSize, height: viewportSize}));
	$: viewport.set({width: viewportSize, height: viewportSize});
	const camera = createCamera();
	$: camera.setDimensions(WORLD_SIZE, WORLD_SIZE, $viewport.width, $viewport.height);

	let stage: Stage0 | undefined | null;
	let setting_up: boolean | undefined;

	let items: Writable<Item[]> | undefined;
	const item_selection: Writable<Item | null> = writable(null);

	$: items = stage?.items;

	const exit: ExitStage = (outcome) => {
		console.log(`exit outcome`, outcome);
		create_stage();
	};

	const create_stage = () => {
		if (setting_up) return;
		setting_up = true;
		if (stage) destroy_stage();
		stage = new Stage0({exit, camera, viewport, layout});
		void stage.setup();
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

	// TODO refactor to be data-driven
	let pane1_height = 256;
	let pane2_width = 256;
	let pane2_height = 205;
	let pane2_offset_y = $layout.height - pane2_height;
	let pane3_width = 256;
	let pane3_height = 384;
	let pane3_offset_y = pane1_height + 20;
</script>

<svelte:window
	on:keydown|capture={(e) => {
		if (e.key === 'Escape' && enableGlobalHotkeys(e.target)) {
			swallow(e);
			toggleEditMode();
		}
	}}
/>

{#if stage}
	{#key stage}
		<World {stage} {pixi} />
		<SurfaceWithController controller={stage.controller} />
		{#if mode === 'editing'}
			<Pane bind:height={pane1_height}>
				<svelte:fragment slot="header">items</svelte:fragment>
				<ItemLayers {stage} {items} {item_selection} />
			</Pane>
			<Pane bind:width={pane2_width} bind:height={pane2_height} bind:offset_y={pane2_offset_y}>
				<svelte:fragment slot="header">scene details</svelte:fragment>
				<SceneDetails {stage} />
			</Pane>
			<Pane bind:width={pane3_width} bind:height={pane3_height} bind:offset_y={pane3_offset_y}>
				<svelte:fragment slot="header">item details</svelte:fragment>
				{#if $item_selection}
					<ItemDetails item={$item_selection} {stage} />
				{/if}
				<!-- TODO text-overflow -->
			</Pane>
		{/if}
	{/key}
	<Hotkeys hotkeys={[{match: 'r', action: () => stage?.restart()}]} />
{/if}
