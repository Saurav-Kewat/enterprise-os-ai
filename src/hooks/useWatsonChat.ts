/**
 * useWatsonChat.ts - backwards-compatible adapter
 * Canonical implementation: src/components/watsonx/WatsonProvider.tsx
 * New code should import from "@/components/watsonx" directly.
 */
export { useWatson as useWatsonChat } from "@/components/watsonx/WatsonProvider";
export {
  WatsonProvider,
  useWatsonStatus,
  useWatsonConversation,
} from "@/components/watsonx/WatsonProvider";
export type {
  WatsonConfig,
  WxoConfig,
  WaConfig,
  DeploymentPlatform,
} from "@/lib/watson-config";
export { getWatsonConfig } from "@/lib/watson-config";
export type { WatsonStatus, WatsonState, WatsonInstance } from "@/types/watson";
// Legacy alias kept for backwards compat - maps to WatsonConfig
export type { WatsonConfig as UseWatsonChatOptions } from "@/lib/watson-config";