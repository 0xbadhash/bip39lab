/**
 * Injected by esbuild so npm slip39 can use Buffer.from in the browser.
 */
import { Buffer } from "buffer";

if (typeof globalThis !== "undefined") {
  globalThis.Buffer = Buffer;
}

export { Buffer };
