// TODO improve, maybe `shift+a,b,ctrl+shift+c`
export interface Hotkey {
	match: HotkeyMatch | HotkeyMatch[];
	action: () => void;
	disabled?: () => boolean;
}

export type HotkeyMatch = string; // TODO add support for shift, press duration, ...

/**
 * Returns `true` if `key` matches the `hotkey`.
 * Currently only supports comma separated single keys, `a,b`.
 * @param hotkey
 * @param key event.key, see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 * @returns
 */
export const matches_hotkey = (hotkey: Hotkey, key: string): boolean => {
	const parsed = parse_hotkey_matches(hotkey);
	for (const p of parsed) {
		if (p === key) {
			return true;
		}
	}
	return false;
};

const parse_hotkey_matches = (hotkey: Hotkey): HotkeyMatch[] => {
	const {match} = hotkey;
	return typeof match === 'string' ? [match] : match;
};
