// ─── Watson Web Chat runtime constants ───────────────────────────────────────
// Kept in a .ts (not .d.ts) file so they are real values, not just types.

/** id attribute set on the injected <script> tag — used to detect duplicates */
export const WATSON_CHAT_SCRIPT_ID = "watson-assistant-chat-script" as const;

/** CDN URL for the Watson Web Chat bootstrap entry */
export const WATSON_CHAT_SCRIPT_SRC =
  "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js" as const;
