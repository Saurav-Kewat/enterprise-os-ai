/**
 * src/components/watsonx/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Public surface of the IBM watsonx Orchestrate integration layer.
 *
 * Import from "@/components/watsonx" to access any part of the integration.
 *
 * Example:
 *   import { WatsonProvider, WatsonChatPanel, useWatson } from "@/components/watsonx";
 */

// ── Provider & hooks ────────────────────────────────────────────────────────
export {
  WatsonProvider,
  useWatson,
  useWatsonStatus,
  useWatsonConversation,
} from "./WatsonProvider";

// ── UI component ────────────────────────────────────────────────────────────
export { WatsonChatPanel } from "./WatsonChat";

// ── Script management ───────────────────────────────────────────────────────
export {
  loadWatsonScript,
  removeWatsonScript,
  isWatsonScriptLoaded,
  WatsonScriptLoadError,
  type LoadScriptOptions,
} from "./WatsonLoader";
