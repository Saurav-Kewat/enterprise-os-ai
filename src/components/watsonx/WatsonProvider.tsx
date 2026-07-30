"use client";

/**
 * WatsonProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * React context and provider for the IBM watsonx Orchestrate integration.
 *
 * Responsibilities:
 *  - Hold the single source of Watson runtime state (status, instance, errors).
 *  - Expose useWatson() hook so any descendant can read state or call actions.
 *  - Expose useWatsonConversation() for conversation history (future-ready).
 *  - Accept a WatsonConfig as a prop — never reads env vars itself.
 *  - Drive the initialization sequence via useWatsonChat() internally.
 *
 * Usage:
 *   <WatsonProvider config={getWatsonConfig()}>
 *     <WatsonChat />
 *     ... rest of AI Workspace layout ...
 *   </WatsonProvider>
 */

import {
  createContext, useContext, useCallback,
  useRef, useState, useEffect, useReducer,
  type ReactNode,
} from "react";
import type {
  WatsonState, WatsonStatus, WatsonInstance,
  ConversationMessage, Conversation,
} from "@/types/watson";
import type { WatsonConfig } from "@/lib/watson-config";
import { getWatsonWindow } from "@/lib/watson-config";

// ─── Context shape ────────────────────────────────────────────────────────────

interface WatsonContextValue extends WatsonState {
  /** The configuration that was passed to the provider */
  config: WatsonConfig | null;
  /** DOM ref — attach this to the container <div> for inline embed mode */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Retry a failed initialization */
  retry: () => void;
  /** Open the chat window programmatically */
  openWindow: () => void;
  /** Close the chat window programmatically */
  closeWindow: () => void;
  /** Send a text message programmatically (silent = don't show user bubble) */
  send: (text: string, silent?: boolean) => Promise<void>;
  /** Current conversation (future-ready) */
  conversation: Conversation | null;
  /** Append a message to the local conversation history */
  appendMessage: (msg: Omit<ConversationMessage, "id" | "timestamp">) => void;
}

// ─── State machine ────────────────────────────────────────────────────────────

type StateAction =
  | { type: "LOADING" }
  | { type: "RENDERING" }
  | { type: "READY"; instance: WatsonInstance }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

function deriveState(status: WatsonStatus, instance: WatsonInstance | null, error: string | null, configured: boolean): WatsonState {
  return {
    status,
    error,
    isLoading:    status === "loading" || status === "rendering",
    isReady:      status === "ready",
    isConfigured: configured,
    instance,
  };
}

type MachineState = { status: WatsonStatus; instance: WatsonInstance | null; error: string | null };

function reducer(state: MachineState, action: StateAction): MachineState {
  switch (action.type) {
    case "LOADING":   return { status: "loading",   instance: null, error: null };
    case "RENDERING": return { status: "rendering", instance: null, error: null };
    case "READY":     return { status: "ready",     instance: action.instance, error: null };
    case "ERROR":     return { status: "error",     instance: null, error: action.message };
    case "RESET":     return { status: "idle",      instance: null, error: null };
    default:          return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WatsonContext = createContext<WatsonContextValue | null>(null);

WatsonContext.displayName = "WatsonContext";

// ─── Provider ─────────────────────────────────────────────────────────────────

interface WatsonProviderProps {
  config: WatsonConfig | null;
  children: ReactNode;
}

export function WatsonProvider({ config, children }: WatsonProviderProps) {
  const isConfigured = config !== null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef  = useRef<WatsonInstance | null>(null);
  const cancelledRef = useRef(false);
  const [retryKey, setRetryKey] = useState(0);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [machine, dispatch] = useReducer(reducer, {
    status:   isConfigured ? "idle" : "unconfigured",
    instance: null,
    error:    null,
  });

  // ── Dynamic import of loader and hook to avoid SSR issues ──────────────────
  useEffect(() => {
    if (!config) {
      dispatch({ type: "RESET" });
      return;
    }

    cancelledRef.current = false;
    dispatch({ type: "LOADING" });

    let unmounted = false;

    // ── onLoad timeout ────────────────────────────────────────────────────────
    // wxoLoader.init() is synchronous but the widget rendering happens async.
    // If nothing mounts within 8 s, transition to error (demo-mode fallback).
    let onLoadTimer: ReturnType<typeof setTimeout> | null = null;

    const startOnLoadTimer = () => {
      onLoadTimer = setTimeout(() => {
        if (unmounted || cancelledRef.current) return;
        dispatch({
          type: "ERROR",
          message:
            "watsonx Orchestrate embed is restricted to production domains. " +
            "Add your deployed domain to the WXO allowlist to enable live chat. " +
            "Running in demo mode for local development.",
        });
      }, 8_000);
    };

    async function initialize() {
      try {
        const { loadWatsonScript } = await import("./WatsonLoader");

        if (config!.platform === "WXO") {
          // ── watsonx Orchestrate native embed ──────────────────────────────
          // Uses window.wxOConfiguration + wxoLoader.init()
          // The container div must have the id we pass as rootElementID.
          const containerId = "wxo-chat-container";
          if (containerRef.current) containerRef.current.id = containerId;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).wxOConfiguration = {
            orchestrationID:    config!.orchestrationID,
            hostURL:            config!.hostURL,
            rootElementID:      containerId,
            deploymentPlatform: config!.deploymentPlatform,
            crn:                config!.crn,
            chatOptions: {
              agentId:            config!.agentId,
              agentEnvironmentId: config!.agentEnvironmentId,
            },
          };

          // Load wxoLoader.js from the instance host — no global CDN
          await loadWatsonScript({ src: config!.loaderURL, timeoutMs: 30_000 });
          if (unmounted || cancelledRef.current) return;

          // Start the onLoad-equivalent timeout BEFORE calling init()
          startOnLoadTimer();

          // wxoLoader.init() mounts the chat into rootElementID
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const loader = (window as any).wxoLoader;
          if (loader && typeof loader.init === "function") {
            loader.init();
          }

          // WXO doesn't use the onLoad callback pattern — mark ready immediately
          // after init() since it is synchronous. Cancel the timer first.
          if (onLoadTimer) clearTimeout(onLoadTimer);
          if (!unmounted && !cancelledRef.current) {
            // WXO instance API is the window.wxOConfiguration handle — we treat
            // it as "ready" and create a stub instance for our state machine.
            const stubInstance: WatsonInstance = {
              render:       async () => {},
              destroy:      () => { try { (window as any).wxoLoader?.destroy?.(); } catch {} },
              openWindow:   () => {},
              closeWindow:  () => {},
              send:         async () => {},
              on:           () => {},
              off:          () => {},
              updateConfig: () => {},
              getSessionID: () => undefined,
            };
            instanceRef.current = stubInstance;
            dispatch({ type: "READY", instance: stubInstance });
            setConversation({
              id:           crypto.randomUUID(),
              sessionId:    undefined,
              messages:     [],
              startedAt:    Date.now(),
              lastActivity: Date.now(),
            });
          }
        } else {
          // ── Watson Assistant Web Chat (WA) ─────────────────────────────────
          const options = {
            integrationID:    config!.integrationID,
            region:           config!.region,
            serviceInstanceID: config!.serviceInstanceID,
            element:          containerRef.current ?? undefined,
            openChatByDefault: config!.openChatByDefault ?? true,
            showLauncher:     false,
            carbonTheme:      config!.carbonTheme ?? "g100",
            locale:           config!.locale ?? "en",
            debug:            config!.debug ?? false,
            onLoad: async (instance: WatsonInstance) => {
              if (unmounted || cancelledRef.current) return;
              if (onLoadTimer) clearTimeout(onLoadTimer);
              instanceRef.current = instance;
              getWatsonWindow().watsonAssistantChatInstance =
                instance as unknown as ReturnType<typeof getWatsonWindow>['watsonAssistantChatInstance'];
              dispatch({ type: "RENDERING" });
              try {
                await instance.render();
                if (!unmounted && !cancelledRef.current) {
                  dispatch({ type: "READY", instance });
                  setConversation({
                    id:           crypto.randomUUID(),
                    sessionId:    instance.getSessionID(),
                    messages:     [],
                    startedAt:    Date.now(),
                    lastActivity: Date.now(),
                  });
                }
              } catch (renderErr) {
                if (!unmounted && !cancelledRef.current) {
                  dispatch({
                    type:    "ERROR",
                    message: renderErr instanceof Error ? renderErr.message : "Render failed",
                  });
                }
              }
            },
          };

          getWatsonWindow().watsonAssistantChatOptions =
            options as unknown as ReturnType<typeof getWatsonWindow>['watsonAssistantChatOptions'];

          await loadWatsonScript({ src: config!.loaderURL, timeoutMs: 30_000 });
          if (unmounted || cancelledRef.current) return;

          // Script loaded — start countdown for WA onLoad callback
          startOnLoadTimer();
        }
      } catch (err) {
        if (onLoadTimer) clearTimeout(onLoadTimer);
        if (unmounted || cancelledRef.current) return;
        const msg = err instanceof Error ? err.message : "Watson initialization failed";
        dispatch({ type: "ERROR", message: msg });
      }
    }

    initialize();

    return () => {
      unmounted = true;
      cancelledRef.current = true;
      if (onLoadTimer) clearTimeout(onLoadTimer);
      if (instanceRef.current) {
        try { instanceRef.current.destroy(); } catch { /* ignore */ }
        instanceRef.current = null;
        getWatsonWindow().watsonAssistantChatInstance = undefined;
      }
      dispatch({ type: "RESET" });
    };
    // retryKey is intentionally in the dependency array — incrementing it
    // triggers a fresh initialization cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.platform, retryKey,
      // Stable identity checks for WXO
      (config as import("@/lib/watson-config").WxoConfig | null)?.orchestrationID,
      (config as import("@/lib/watson-config").WxoConfig | null)?.agentId,
      // Stable identity checks for WA
      (config as import("@/lib/watson-config").WaConfig | null)?.integrationID,
      (config as import("@/lib/watson-config").WaConfig | null)?.region,
  ]);

  // ── Stable action callbacks ─────────────────────────────────────────────────

  const retry = useCallback(() => {
    cancelledRef.current = true;
    if (instanceRef.current) {
      try { instanceRef.current.destroy(); } catch { /* ignore */ }
      instanceRef.current = null;
    }
    dispatch({ type: "RESET" });
    setTimeout(() => {
      cancelledRef.current = false;
      setRetryKey((k) => k + 1);
    }, 100);
  }, []);

  const openWindow  = useCallback(() => instanceRef.current?.openWindow(), []);
  const closeWindow = useCallback(() => instanceRef.current?.closeWindow(), []);

  const send = useCallback(async (text: string, silent = false) => {
    await instanceRef.current?.send({ input: { text } }, { silent });
  }, []);

  const appendMessage = useCallback((msg: Omit<ConversationMessage, "id" | "timestamp">) => {
    setConversation((prev) => {
      if (!prev) return null;
      const full: ConversationMessage = {
        ...msg,
        id:        crypto.randomUUID(),
        timestamp: Date.now(),
      };
      return {
        ...prev,
        messages:     [...prev.messages, full],
        lastActivity: Date.now(),
      };
    });
  }, []);

  // ── Derived state ───────────────────────────────────────────────────────────

  const state = deriveState(machine.status, machine.instance, machine.error, isConfigured);

  const value: WatsonContextValue = {
    ...state,
    config,
    containerRef,
    retry,
    openWindow,
    closeWindow,
    send,
    conversation,
    appendMessage,
  };

  return (
    <WatsonContext.Provider value={value}>
      {children}
    </WatsonContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Access the full Watson integration state and actions.
 * Must be used inside a <WatsonProvider>.
 */
export function useWatson(): WatsonContextValue {
  const ctx = useContext(WatsonContext);
  if (!ctx) {
    throw new Error(
      "useWatson() must be used inside <WatsonProvider>. " +
      "Wrap your AI Workspace with <WatsonProvider config={...}>."
    );
  }
  return ctx;
}

/**
 * Lightweight hook that returns only the connection status and error.
 * Useful for status indicators that don't need the full context.
 */
export function useWatsonStatus() {
  const { status, error, isLoading, isReady, isConfigured } = useWatson();
  return { status, error, isLoading, isReady, isConfigured };
}

/**
 * Returns the current conversation and appendMessage helper.
 * Future-ready: wires into real IBM conversation history when available.
 */
export function useWatsonConversation() {
  const { conversation, appendMessage, send } = useWatson();
  return { conversation, appendMessage, send };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract the IBM Cloud region short code from a full host URL.
 *
 * Examples:
 *   "https://us-south.assistant.watson.cloud.ibm.com"  → "us-south"
 *   "https://eu-gb.watson-orchestrate.cloud.ibm.com"   → "eu-gb"
 *   "https://eu-de.assistant.watson.cloud.ibm.com"     → "eu-de"
 */
function extractRegionFromHost(hostURL: string): string {
  try {
    const { hostname } = new URL(hostURL);
    // Matches: us-south, eu-gb, eu-de, au-syd, jp-tok, ca-tor, etc.
    const match = hostname.match(/^([a-z]{2}-[a-z]{2,}(?:-[a-z]+)?)\./);
    return match?.[1] ?? "eu-gb";
  } catch {
    return "eu-gb";
  }
}

/**
 * Extract the service instance GUID from an IBM Cloud CRN.
 *
 * CRN format:
 *   crn:v1:bluemix:public:SERVICE:REGION:a/ACCOUNT:INSTANCE::
 *
 * Example CRN:
 *   crn:v1:bluemix:public:watsonx-orchestrate:eu-gb:a/5af064...bb99622:b27fceb1-2377-4032-bb69-b17ea02ac831::
 *   → instance ID: b27fceb1-2377-4032-bb69-b17ea02ac831
 */
function extractInstanceIdFromCrn(crn: string): string {
  try {
    // Split on ":" and take the 8th segment (index 7)
    const parts = crn.split(":");
    // parts[7] is the instance GUID in the standard CRN layout
    const instance = parts[7];
    if (instance && instance.length > 0) return instance;
    // Fallback: last UUID-shaped segment
    const uuidMatch = crn.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    return uuidMatch?.[1] ?? crn;
  } catch {
    return crn;
  }
}
