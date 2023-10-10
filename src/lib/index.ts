// place files you want to import through the `$lib` alias in this folder.
import { writable } from 'svelte/store';

function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update((d) => d + 1),
		decrement: () => update((d) => d - 1),
		reset: () => set(0)
	};
}

export const count = createCount();
