/**
 * WatsonLoader.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Framework-agnostic script loading utility for IBM Watson Web Chat /
 * watsonx Orchestrate.
 *
 * Responsibilities:
 *  - Inject exactly ONE <script> tag regardless of how many times it is called.
 *  - Detect and reuse an already-injected script (e.g. Fast-Refresh / HMR).
 *  - Support a configurable timeout to catch silent network failures.
 *  - Provide a clean unload API for test environments or full unmounts.
 *  - Never throw synchronously — all errors surface through Promise rejection.
 */

import { WATSON_SCRIPT_TAG_ID } from "@/lib/watson-config";

// ─── Module-level singleton promise ──────────────────────────────────────────
// Shared across all component instances so the script is fetched exactly once.
let _loadPromise: Promise<void> | null = null;

// ─── Public API ───────────────────────────────────────────────────────────────

export interface LoadScriptOptions {
  /** URL of the Watson/watsonx loader script */
  src: string;
  /** Abort if the script has not loaded within this many milliseconds (default 30 000) */
  timeoutMs?: number;
}

/**
 * Inject the Watson loader script into `document.head`, or resolve immediately
 * if it was already injected during a previous call or a prior page visit.
 *
 * Idempotent — safe to call from multiple component instances concurrently.
 */
export function loadWatsonScript(options: LoadScriptOptions): Promise<void> {
  // Return the in-flight promise if loading is already underway
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<void>((resolve, reject) => {
    // ── Already in DOM (e.g. Fast Refresh, SSR hydration) ──────────────────
    if (document.getElementById(WATSON_SCRIPT_TAG_ID)) {
      resolve();
      return;
    }

    const { src, timeoutMs = 30_000 } = options;

    // ── Timeout guard ────────────────────────────────────────────────────────
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      // Remove the script tag so a retry can re-inject cleanly
      removeWatsonScript();
      reject(
        new WatsonScriptLoadError(
          `Watson script did not load within ${timeoutMs / 1000}s. ` +
          "Check your network connection or the loader URL."
        )
      );
    }, timeoutMs);

    // ── Create and inject <script> ───────────────────────────────────────────
    const el = document.createElement("script");
    el.id         = WATSON_SCRIPT_TAG_ID;
    el.src        = src;
    el.async      = true;
    el.defer      = true;
    el.crossOrigin = "anonymous";

    el.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };

    el.onerror = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      removeWatsonScript();
      reject(
        new WatsonScriptLoadError(
          `Failed to load Watson script from "${src}". ` +
          "The CDN may be unreachable or the URL is incorrect.",
          event
        )
      );
    };

    document.head.appendChild(el);
  });

  // Reset the singleton on failure so the next attempt can retry
  _loadPromise.catch(() => {
    _loadPromise = null;
  });

  return _loadPromise;
}

/**
 * Remove the Watson script tag from the DOM and reset the singleton promise.
 * Call this when you need a clean retry or during unit test teardown.
 */
export function removeWatsonScript(): void {
  const existing = document.getElementById(WATSON_SCRIPT_TAG_ID);
  existing?.remove();
  _loadPromise = null;
}

/**
 * Returns true when the Watson script tag is currently in the DOM.
 */
export function isWatsonScriptLoaded(): boolean {
  return typeof document !== "undefined" &&
    !!document.getElementById(WATSON_SCRIPT_TAG_ID);
}

// ─── Custom error ─────────────────────────────────────────────────────────────

export class WatsonScriptLoadError extends Error {
  readonly originalEvent?: Event | string | unknown;

  constructor(message: string, originalEvent?: Event | string | unknown) {
    super(message);
    this.name = "WatsonScriptLoadError";
    this.originalEvent = originalEvent;
    // Fix prototype chain in environments that don't fully support extends Error
    Object.setPrototypeOf(this, WatsonScriptLoadError.prototype);
  }
}
