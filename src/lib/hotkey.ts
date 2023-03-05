export interface Hotkey {
	match: string;
	action: () => void;
	parsed?: ParsedHotkeyMatch[];
}

// TODO improve, maybe `shift+a,b,ctrl+shift+c`
export type ParsedHotkeyMatch = string;

/**
 * Returns `true` if `key` matches the `hotkey`.
 * Currently only supports comma separated single keys, `a,b`.
 * @param hotkey
 * @param key event.key, see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 * @returns
 */
export const matchesHotkey = (hotkey: Hotkey, key: string): boolean => {
	const parsed = parseHotkeyMatch(hotkey);
	for (const p of parsed) {
		if (p === key) {
			return true;
		}
	}
	return false;
};

const parseHotkeyMatch = (hotkey: Hotkey): ParsedHotkeyMatch[] =>
	hotkey.parsed || (hotkey.parsed = hotkey.match.split(','));
