export const next_unique_name = (scenes: Array<{name: string}>, name: string): string => {
	let n = name;
	let counter = 0;
	while (scenes.find((s) => s.name === n)) {
		counter++;
		n = name + ' ' + counter;
	}
	return n;
};
