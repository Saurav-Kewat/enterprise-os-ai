// watson.d.ts
// Global Window augmentations for IBM watsonx Orchestrate + Watson Web Chat.
// Inline declarations (no imports) so the global augmentation is always active.

export {};

declare global {
  // ── watsonx Orchestrate native embed (wxoLoader) ──────────────────────────
  interface Window {
    /** Config object read by wxoLoader.js before init() is called. */
    wxOConfiguration: {
      orchestrationID: string;
      hostURL: string;
      rootElementID: string;
      deploymentPlatform: string;
      crn: string;
      chatOptions?: {
        agentId?: string;
        agentEnvironmentId?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }

  /** wxoLoader namespace injected by wxoLoader.js */
  const wxoLoader: {
    init(): void;
    destroy?(): void;
    [key: string]: unknown;
  };

  // ── Watson Web Chat (legacy / WA fallback) ────────────────────────────────
  interface Window {
    /** Config consumed by WatsonAssistantChatEntry.js */
    watsonAssistantChatOptions: {
      integrationID: string;
      region: string;
      serviceInstanceID: string;
      element?: HTMLElement | null;
      openChatByDefault?: boolean;
      showLauncher?: boolean;
      onLoad?: (instance: WatsonRuntimeInstance) => void | Promise<void>;
      debug?: boolean;
      locale?: string;
      carbonTheme?: string;
      [key: string]: unknown;
    };
    watsonAssistantChatInstance?: WatsonRuntimeInstance;
  }

  /** Minimal Watson Web Chat runtime instance */
  interface WatsonRuntimeInstance {
    render(): Promise<void>;
    destroy(): void;
    openWindow(): void;
    closeWindow(): void;
    send(msg: { input: { text: string } }, opts?: { silent?: boolean }): Promise<void>;
    on(event: string, handler: (...a: unknown[]) => void): void;
    off(event: string, handler: (...a: unknown[]) => void): void;
    updateConfig(opts: Record<string, unknown>): void;
    getSessionID(): string | undefined;
  }
}