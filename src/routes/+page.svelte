<script lang="ts">
	import {Portal} from '@feltcoop/dealt';
	import ControlScene from '$routes/ControlScene.svelte';
</script>

<main>
	<Portal>
		<ControlScene />
	</Portal>
</main>

<style>
	main {
		position: absolute;
		inset: 0;
	}
</style>
