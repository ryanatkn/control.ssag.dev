import {test} from 'uvu';
import * as assert from 'uvu/assert';
import {noop} from '@feltjs/util/function.js';

import {matchesHotkey, type Hotkey} from '$lib/hotkey';

test('matches a simple pattern', () => {
	matchesHotkey({match: 'a', action: noop}, 'a');
});

test('matches comma-separated values', () => {
	matchesHotkey({match: 'a,b', action: noop}, 'a');
	matchesHotkey({match: 'a,b', action: noop}, 'b');
	matchesHotkey({match: 'a,b,c', action: noop}, 'a');
	matchesHotkey({match: 'a,b,c', action: noop}, 'b');
	matchesHotkey({match: 'a,b,c', action: noop}, 'c');
});

test('caches the parsed data', () => {
	const hotkey: Hotkey = {match: 'a', action: noop};
	matchesHotkey(hotkey, 'a');
	assert.ok(hotkey.parsed);
});

test.run();
