import { writable } from 'svelte/store';

export const chatHistory = writable([
  { type: 'sys', text: "NEURAL LINK MODULAR v2.2 ONLINE" }
]);
export const isProcessing = writable(false);
