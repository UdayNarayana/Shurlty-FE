import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically cleanup DOM after each test
afterEach(() => {
	cleanup();
});

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {}, // deprecated
		removeListener: () => {}, // deprecated
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});

// scrollTo is sometimes called by components
Object.defineProperty(window, "scrollTo", {
	value: () => {},
	writable: true,
});

// ---- Optional: stable crypto mock (if needed) ----
// Uncomment ONLY if you see errors related to crypto.randomUUID
/*
Object.defineProperty(globalThis, "crypto", {
	value: {
		randomUUID: () => "test-uuid",
	},
});
*/
