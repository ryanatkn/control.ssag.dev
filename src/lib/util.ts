import type {Hsl} from '@feltcoop/dealt';

// TODO upstream
export const toHslCss = (color: Hsl): string =>
	`hsl(${360 * color[0]}deg, ${color[1] * 100}%, ${color[2] * 100}%)`;
