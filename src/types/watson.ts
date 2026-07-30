/**
 * watson.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete type definitions for the IBM Watson Web Chat / watsonx Orchestrate
 * embedded chat runtime API.
 *
 * These are value-safe runtime types (not a .d.ts declaration file) so they
 * can be imported normally alongside the global augmentation in watson.d.ts.
 *
 * Reference:
 *   https://web-chat.global.assistant.watson.appdomain.cloud/docs
 */

// ─── Watson instance API ──────────────────────────────────────────────────────

export interface WatsonInstance {
  /** Mount the chat widget into the target DOM element */
  render(): Promise<void>;
  /** Unmount, destroy all listeners, and release DOM nodes */
  destroy(): void;
  /** Programmatically open the chat window */
  openWindow(): void;
  /** Programmatically close the chat window */
  closeWindow(): void;
  /**
   * Send a message on behalf of the user.
   * Pass `{ silent: true }` to send without displaying the user turn in the UI.
   */
  send(
    message: { input: { text: string } },
    options?: { silent?: boolean }
  ): Promise<void>;
  /** Subscribe to a Watson Web Chat lifecycle event */
  on(event: WatsonEvent, handler: WatsonEventHandler): void;
  /** Unsubscribe from a Watson Web Chat lifecycle event */
  off(event: WatsonEvent, handler: WatsonEventHandler): void;
  /** Update configuration at runtime without a full reload */
  updateConfig(options: Partial<WatsonInitOptions>): void;
  /** Return the active session ID, or undefined before a session starts */
  getSessionID(): string | undefined;
}

// ─── Initialization options ───────────────────────────────────────────────────

/** Options passed to window.watsonAssistantChatOptions before script load */
export interface WatsonInitOptions {
  /** Integration ID from the Watson Assistant / watsonx Orchestrate deployment */
  integrationID: string;
  /** IBM Cloud region, e.g. "us-south", "eu-de", "au-syd" */
  region: string;
  /** Service instance GUID */
  serviceInstanceID: string;
  /**
   * DOM element to render the chat into (inline / embedded mode).
   * When omitted, the widget floats as a launcher button.
   */
  element?: HTMLElement | null;
  /** Open the chat window automatically on render */
  openChatByDefault?: boolean;
  /** Hide the floating launcher button when using inline mode */
  showLauncher?: boolean;
  /** Called with the instance once the script has loaded */
  onLoad?: (instance: WatsonInstance) => void | Promise<void>;
  /** Enable verbose console debug output */
  debug?: boolean;
  /** BCP 47 language code, e.g. "en", "de", "ja" */
  locale?: string;
  /** Carbon Design System theme applied to the widget */
  carbonTheme?: "g10" | "g90" | "g100";
  /** Fine-grained theme tokens */
  themeConfig?: {
    carbonTheme?: "g10" | "g90" | "g100";
    corners?: "square" | "round";
  };
  /** Custom CSS variables applied to the widget */
  cssVariables?: Record<string, string>;
  /** Additional watsonx Orchestrate-specific options */
  [key: string]: unknown;
}

// ─── Events ───────────────────────────────────────────────────────────────────

/** Union of all standard Web Chat lifecycle event names */
export type WatsonEvent =
  | "send"
  | "receive"
  | "window:open"
  | "window:close"
  | "view:change"
  | "history:begin"
  | "session:start"
  | "identityTokenExpired"
  | "agent:startedTyping"
  | "agent:stoppedTyping"
  | "error"
  // Allow any custom event names for forward compatibility
  | (string & Record<never, never>);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WatsonEventHandler = (...args: any[]) => void;

// ─── Chat state ───────────────────────────────────────────────────────────────

/** All possible lifecycle states of the Watson integration */
export type WatsonStatus =
  | "unconfigured" // no credentials supplied
  | "idle"         // credentials present but not yet started
  | "loading"      // <script> tag injected, awaiting onLoad callback
  | "rendering"    // onLoad fired, instance.render() in progress
  | "ready"        // widget fully mounted and interactive
  | "error";       // irrecoverable failure (show error UI)

export interface WatsonState {
  status: WatsonStatus;
  error: string | null;
  /** True when any async initialization work is in progress */
  isLoading: boolean;
  /** True when the widget is fully interactive */
  isReady: boolean;
  /** True when credentials are configured */
  isConfigured: boolean;
  /** The live instance (only when status === "ready") */
  instance: WatsonInstance | null;
}

// ─── Conversation types (future-ready) ───────────────────────────────────────

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  agentRefs?: string[];
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  sessionId: string | undefined;
  messages: ConversationMessage[];
  startedAt: number;
  lastActivity: number;
}
