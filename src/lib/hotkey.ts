export interface Hotkey {
	match: string;
	action: () => void;
	parsed?: ParsedHotkeyMatch[];
}

// TODO
export type ParsedHotkeyMatch = string;

/**
 * Returns `true` if `key` matches the `hotkey`.
 * Currently only supports comma separated single keys, `a,b`.
 * @param hotkey
 * @param key event.key, see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 * @returns
 */
export const matchesHotkey = (hotkey: Hotkey, key: string): boolean => {
	// TODO parse `match` from some matching pattern
	const parsed = parseHotkeyMatch(hotkey);
	for (const p of parsed) {
		// TODO improve, maybe `shift+a,b,ctrl+shift+c`
		if (p === key) {
			return true;
		}
	}
	return false;
};

const parseHotkeyMatch = (hotkey: Hotkey): ParsedHotkeyMatch[] =>
	hotkey.parsed || (hotkey.parsed = hotkey.match.split(','));
