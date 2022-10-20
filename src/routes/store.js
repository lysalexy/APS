import { writable } from 'svelte/store';

export const currentTime = writable(0);
export const finishedRequests = writable(0);
export const previousN = writable(0);
export const previousP = writable(0);
export const currentEvent = writable(0);
export const currentN = writable(0);
export const sources = writable([]);
export const recievers = writable([]);
export const buffer = writable([]);