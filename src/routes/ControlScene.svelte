<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import {
		World,
		set_viewport,
		SurfaceWithController,
		get_pixi,
		create_camera,
		get_layout,
		type ExitStage,
		type Item,
		enable_global_hotkeys,
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
	import CameraDetails from '$routes/CameraDetails.svelte';
	import Hotkeys from '$lib/Hotkeys.svelte';
	import ProjectDetails from '$routes/ProjectDetails.svelte';
	import ControlledItem from '$routes/ControlledItem.svelte';
	import {Project} from '$lib/project';
	import ItemControls from './ItemControls.svelte';

	export let pixi = get_pixi();
	export let layout = get_layout();

	// TODO refactor
	const project = new Project();

	// TODO resizable pane component
	// TODO contextmenu to enable dragging on windows

	// TODO BLOCK drag to pan

	// TODO where does this belong?
	type SceneMode = 'playing' | 'editing';
	let mode: SceneMode = dev ? 'editing' : 'playing';

	const toggleEditMode = (enable = mode !== 'editing'): void => {
		mode = enable ? 'editing' : 'playing';
	};

	let viewportSize = Math.min($layout.width, $layout.height);
	$: viewportSize = Math.min($layout.width, $layout.height);

	// Scenes control the `viewport` and `camera`.
	const viewport = set_viewport(writable({width: viewportSize, height: viewportSize}));
	$: viewport.set({width: viewportSize, height: viewportSize});
	const camera = create_camera();
	$: camera.set_dimensions(WORLD_SIZE, WORLD_SIZE, $viewport.width, $viewport.height);

	let stage: Stage0 | undefined | null;
	let setting_up: boolean | undefined;

	let items: Writable<Item[]> | undefined;
	const item_selection: Writable<Item | null> = writable(null);

	$: items = stage?.items;
	$: controlled = stage?.controlled;

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
	const PANE_MARGIN = 3;
	const PANE_WIDTH = 256;
	let pane0_height = 160;
	let pane1_height = 214;
	let pane1_offset_y = pane0_height + PANE_MARGIN;
	let pane5_width = PANE_WIDTH;
	let pane5_height = 202;
	let pane5_offset_x = $layout.width - pane5_width;
	let pane3_width = PANE_WIDTH;
	let pane3_height = 297;
	let pane3_offset_y = pane1_offset_y + pane1_height + PANE_MARGIN;
	let pane2_width = PANE_WIDTH;
	let pane2_height = 384;
	let pane2_offset_x = pane5_offset_x;
	let pane2_offset_y = pane5_height + PANE_MARGIN;
	let pane4_width = PANE_WIDTH;
	let pane4_height = $layout.height - pane2_height - pane5_height - PANE_MARGIN;
	let pane4_offset_x = pane2_offset_x;
	let pane4_offset_y = pane2_offset_y + pane2_height + PANE_MARGIN;

	let pointer_down: boolean;
	let pointer_x: number;
	let pointer_y: number;
	$: if (pointer_down && stage) handle_pointer_down();
	const handle_pointer_down = () => {
		const item = stage!.handle_pointer_down(pointer_x, pointer_y);
		if (item && item !== $item_selection) {
			$item_selection = item;
		}
	};

	const center_camera_on = (item: Item | null | undefined) => {
		if (!item) return;
		camera.set_position(item.$x, item.$y);
	};
</script>

<svelte:window
	on:keydown|capture={(e) => {
		if (e.key === 'Escape' && enable_global_hotkeys(e.target)) {
			swallow(e);
			toggleEditMode();
		}
	}}
/>

{#if stage}
	<Hotkeys
		hotkeys={[
			{match: 'r', action: () => stage?.restart()},
			{
				match: 'c',
				action: () => center_camera_on($item_selection),
				disabled: () => mode !== 'editing' && !$controlled && !!$item_selection,
			},
		]}
	/>
	{#key stage}
		<World {stage} {pixi} />
		<SurfaceWithController
			controller={stage.controller}
			bind:pointer_down
			bind:pointer_x
			bind:pointer_y
		/>
		{#if mode === 'editing'}
			{#if $item_selection && !$controlled}
				<ItemControls item={$item_selection} {stage} />
			{/if}
			<Pane bind:height={pane0_height}>
				<svelte:fragment slot="header">project</svelte:fragment>
				<div class="mode-buttons">
					<button class="selected"> edit </button>
					<button on:click={() => (mode = 'playing')}> play </button>
				</div>
				<ProjectDetails {project} />
			</Pane>
			<Pane bind:height={pane1_height} bind:offset_y={pane1_offset_y}>
				<svelte:fragment slot="header">scene</svelte:fragment>
				<SceneDetails {stage} />
			</Pane>
			<Pane
				bind:width={pane2_width}
				bind:height={pane2_height}
				bind:offset_x={pane2_offset_x}
				bind:offset_y={pane2_offset_y}
			>
				<svelte:fragment slot="header">items</svelte:fragment>
				<ItemLayers {stage} {items} {item_selection} />
			</Pane>
			<Pane bind:width={pane3_width} bind:height={pane3_height} bind:offset_y={pane3_offset_y}>
				<svelte:fragment slot="header">camera</svelte:fragment>
				<CameraDetails {stage} />
			</Pane>
			<Pane bind:width={pane5_width} bind:height={pane5_height} bind:offset_x={pane5_offset_x}>
				<svelte:fragment slot="header">controlled item</svelte:fragment>
				<ControlledItem {stage} selected={$item_selection} />
			</Pane>
			<Pane
				bind:width={pane4_width}
				bind:height={pane4_height}
				bind:offset_x={pane4_offset_x}
				bind:offset_y={pane4_offset_y}
			>
				<svelte:fragment slot="header">selected item</svelte:fragment>
				{#if $item_selection}
					<ItemDetails item={$item_selection} {stage} />
				{/if}
				<!-- TODO text-overflow -->
			</Pane>
		{/if}
	{/key}
{/if}

<style>
	.mode-buttons {
		display: flex;
		height: var(--input_height_sm);
	}
	.mode-buttons button {
		flex: 1;
		height: var(--input_height_sm);
		min-height: var(--input_height_sm);
		padding-top: 0;
		padding-bottom: 0;
	}
</style>
