<script lang="ts">
	import {enable_global_hotkeys} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';

	import {type Hotkey, matches_hotkey} from '$lib/hotkey';

	export let hotkeys: Hotkey[] = [];

	const keydown = (key: string, target: any): boolean => {
		for (const hotkey of hotkeys) {
			const matched = matches_hotkey(hotkey, key);
			if (matched && (!target || enable_global_hotkeys(target))) {
				hotkey.action();
				return true; // handle only the first match
			}
		}
		return false;
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (keydown(e.key, e.target)) {
			swallow(e);
		}
	}}
/>
