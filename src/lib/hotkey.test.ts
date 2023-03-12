import {test} from 'uvu';
import * as assert from 'uvu/assert';
import {noop} from '@feltjs/util/function.js';

import {matches_hotkey} from '$lib/hotkey';

test('matches a simple pattern', () => {
	assert.ok(matches_hotkey({match: 'a', action: noop}, 'a'));
});

test('matches multiple values', () => {
	assert.ok(matches_hotkey({match: ['a', 'b'], action: noop}, 'a'));
	assert.ok(matches_hotkey({match: ['a', 'b'], action: noop}, 'b'));
	assert.ok(matches_hotkey({match: ['a', 'b', 'c'], action: noop}, 'a'));
	assert.ok(matches_hotkey({match: ['a', 'b', 'c'], action: noop}, 'b'));
	assert.ok(matches_hotkey({match: ['a', 'b', 'c'], action: noop}, 'c'));
});

test.run();
