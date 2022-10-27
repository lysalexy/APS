import { writable } from 'svelte/store';

export const currentTime = writable(0);
export const mode=writable('no')

export const previousAmountOfRequests = writable(0);//пока не использовалась
export const previousP = writable(0);//пока не использовалась

export const currentEvent = writable('');

export const finishedRequests = writable(0);
export const generatedRequests = writable(0);
export const refusedRequests = writable(0);
export const summaryAmountOfRequests = writable(0);
export const firstSummaryAmountOfRequests = writable(0);

export const requestSource =writable(0);
export const requestNumber = writable(0);

export const sources = writable([]);
export const recievers = writable([]);
export const buffer = writable([]);

// export const sourcesForStepMode=writable([]);
// export const recieversForStepMode=writable([]);
// export const bufferForStepMode = writable([]);

export const alfa = writable(0);
export const beta = writable(0);
export const lambda = writable(0);