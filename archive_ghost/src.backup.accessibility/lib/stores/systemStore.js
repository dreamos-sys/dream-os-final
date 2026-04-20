import { writable } from 'svelte/store';
export const theme = writable('dark');
export const language = writable('id');
export const batterySaver = writable(false);
