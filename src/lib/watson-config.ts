/**
 * watson-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for IBM watsonx Orchestrate / Watson Assistant
 * configuration.  All values come from environment variables so nothing
 * sensitive is ever committed to source control.
 *
 * Usage:
 *   import { getWatsonConfig } from "@/lib/watson-config";
 *   const config = getWatsonConfig();  // returns null when unconfigured
 */

// ─── Deployment platform discriminator ───────────────────────────────────────

/** "WXO" = IBM watsonx Orchestrate  |  "WA" = Watson Assistant Web Chat */
export type DeploymentPlatform = "WXO" | "WA";

// ─── watsonx Orchestrate config ───────────────────────────────────────────────

export interface WxoConfig {
  platform: "WXO";
  /** Base URL of the watsonx Orchestrate instance */
  hostURL: string;
  /** IBM Cloud Resource Name for the service instance */
  crn: string;
  /** Orchestration / deployment ID assigned in watsonx Orchestrate */
  orchestrationID: string;
  /** Agent identifier */
  agentId: string;
  /** Agent environment ID (e.g. "draft" or "live") */
  agentEnvironmentId: string;
  /** Deployment platform identifier, e.g. "ibmcloud" */
  deploymentPlatform: string;
  /** Loader script URL — defaults to IBM CDN */
  loaderURL: string;
  /** Open chat automatically on mount */
  openChatByDefault?: boolean;
  /** Hide the floating launcher button (use when embedding inline) */
  showLauncher?: boolean;
  /** Carbon design theme applied to the widget */
  carbonTheme?: "g10" | "g90" | "g100";
  /** BCP 47 locale code */
  locale?: string;
  /** Enable console debug output */
  debug?: boolean;
}

// ─── Watson Assistant Web Chat config (legacy / fallback) ─────────────────────

export interface WaConfig {
  platform: "WA";
  /** Integration ID from the Watson Assistant Web Chat deployment tab */
  integrationID: string;
  /** IBM Cloud region, e.g. "us-south" */
  region: string;
  /** Service instance GUID */
  serviceInstanceID: string;
  /** Loader script URL — defaults to IBM CDN */
  loaderURL: string;
  openChatByDefault?: boolean;
  showLauncher?: boolean;
  carbonTheme?: "g10" | "g90" | "g100";
  locale?: string;
  debug?: boolean;
}

/** Union of both supported configuration shapes */
export type WatsonConfig = WxoConfig | WaConfig;

// ─── Script CDN URLs ──────────────────────────────────────────────────────────

/**
 * Default script CDN URLs.
 *
 * WXO: loader is served from the instance's own hostURL, not a global CDN.
 *      The URL is built dynamically in getWatsonConfig() as:
 *      `${hostURL}/wxochat/wxoLoader.js?embed=true`
 * WA:  standard IBM Watson Web Chat CDN.
 */
export const DEFAULT_LOADER_URLS = {
  WA: "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js",
} as const;

/** DOM id placed on the injected <script> — prevents duplicate injection */
export const WATSON_SCRIPT_TAG_ID = "ibm-watson-chat-loader" as const;

// ─── Config factory ───────────────────────────────────────────────────────────

/**
 * Build a WatsonConfig from environment variables.
 *
 * Resolution order:
 *   1. If NEXT_PUBLIC_WXO_HOST_URL is set  → WXO (watsonx Orchestrate) config
 *   2. If NEXT_PUBLIC_WATSON_INTEGRATION_ID is set → WA (Watson Assistant) config
 *   3. Otherwise → null (no credentials; demo mode will activate)
 *
 * All variables must be prefixed with NEXT_PUBLIC_ so Next.js inlines them
 * into the client bundle at build time.
 */
export function getWatsonConfig(): WatsonConfig | null {
  // ── watsonx Orchestrate path ──────────────────────────────────────────────
  const hostURL             = process.env.NEXT_PUBLIC_WXO_HOST_URL;
  const orchestrationID     = process.env.NEXT_PUBLIC_WXO_ORCHESTRATION_ID;
  const crn                 = process.env.NEXT_PUBLIC_WXO_CRN;
  const agentId             = process.env.NEXT_PUBLIC_WXO_AGENT_ID;
  // Support both env var names — AGENT_ENVIRONMENT_ID is the canonical form
  const agentEnvironmentId  =
    process.env.NEXT_PUBLIC_WXO_AGENT_ENVIRONMENT_ID ??
    process.env.NEXT_PUBLIC_WXO_AGENT_ENV_ID;
  const deploymentPlatform  =
    process.env.NEXT_PUBLIC_WXO_DEPLOYMENT_PLATFORM ?? "ibmcloud";

  if (hostURL && orchestrationID && crn && agentId && agentEnvironmentId) {
    // WXO loader URL is served from the instance host — not a global CDN
    const wxoLoaderURL =
      process.env.NEXT_PUBLIC_WXO_LOADER_URL ??
      `${hostURL}/wxochat/wxoLoader.js?embed=true`;

    return {
      platform:            "WXO",
      hostURL,
      orchestrationID,
      crn,
      agentId,
      agentEnvironmentId,
      deploymentPlatform,
      loaderURL:           wxoLoaderURL,
      openChatByDefault:   true,
      showLauncher:        false,
      carbonTheme:         "g100",
      locale:              process.env.NEXT_PUBLIC_WATSON_LOCALE    ?? "en",
      debug:               process.env.NEXT_PUBLIC_WATSON_DEBUG === "true",
    };
  }

  // ── Watson Assistant Web Chat fallback path ───────────────────────────────
  const integrationID    = process.env.NEXT_PUBLIC_WATSON_INTEGRATION_ID;
  const region           = process.env.NEXT_PUBLIC_WATSON_REGION;
  const serviceInstanceID = process.env.NEXT_PUBLIC_WATSON_SERVICE_INSTANCE_ID;

  if (integrationID && region && serviceInstanceID) {
    return {
      platform:           "WA",
      integrationID,
      region,
      serviceInstanceID,
      loaderURL:          process.env.NEXT_PUBLIC_WA_LOADER_URL   ?? DEFAULT_LOADER_URLS.WA,
      openChatByDefault:  true,
      showLauncher:       false,
      carbonTheme:        "g100",
      locale:             process.env.NEXT_PUBLIC_WATSON_LOCALE   ?? "en",
      debug:              process.env.NEXT_PUBLIC_WATSON_DEBUG === "true",
    };
  }

  // No credentials found — caller should activate demo mode
  return null;
}

// ─── Type-safe window helpers ─────────────────────────────────────────────────
// Avoids relying on global Window augmentation which can be unreliable
// across different TypeScript module resolutions.

type WatsonWindowOptions = {
  integrationID: string;
  region: string;
  serviceInstanceID: string;
  element?: HTMLElement | null;
  openChatByDefault?: boolean;
  showLauncher?: boolean;
  onLoad?: (instance: unknown) => void | Promise<void>;
  debug?: boolean;
  locale?: string;
  carbonTheme?: string;
  [key: string]: unknown;
};

type WatsonWindow = Window & typeof globalThis & {
  watsonAssistantChatOptions: WatsonWindowOptions;
  watsonAssistantChatInstance?: { destroy(): void; getSessionID(): string | undefined };
};

export function getWatsonWindow(): WatsonWindow {
  return window as WatsonWindow;
}

export type { WatsonWindowOptions };

// ─── Type guards ──────────────────────────────────────────────────────────────

/** Type narrowing: check whether a config is WXO */
export function isWxoConfig(cfg: WatsonConfig): cfg is WxoConfig {
  return cfg.platform === "WXO";
}

/** Type narrowing: check whether a config is WA */
export function isWaConfig(cfg: WatsonConfig): cfg is WaConfig {
  return cfg.platform === "WA";
}

