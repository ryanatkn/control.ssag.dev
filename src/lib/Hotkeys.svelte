<script lang="ts">
	import {enable_global_hotkeys} from '@feltcoop/dealt';
	import {swallow} from '@feltjs/util/dom.js';

	import {type Hotkey, matchesHotkey} from '$lib/hotkey';

	export let hotkeys: Hotkey[] = [];

	const handleKeydown = (key: string, target: any): boolean => {
		for (const hotkey of hotkeys) {
			const matched = matchesHotkey(hotkey, key);
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
		if (handleKeydown(e.key, e.target)) {
			swallow(e);
		}
	}}
/>
