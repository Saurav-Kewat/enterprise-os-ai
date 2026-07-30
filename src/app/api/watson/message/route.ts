/**
 * /api/watson/message — send a message to the IBM WXO agent and return the response
 *
 * POST body:  { sessionId: string | null, text: string }
 * Returns:    { response: string, sessionId: string }
 */

import { NextResponse } from "next/server";

const HOST_URL            = process.env.NEXT_PUBLIC_WXO_HOST_URL ?? "";
const AGENT_ID            = process.env.NEXT_PUBLIC_WXO_AGENT_ID ?? "";
const IBM_API_KEY         = process.env.IBM_WATSON_API_KEY ?? "";
const SERVICE_INSTANCE_ID = (() => {
  // CRN: crn:v1:bluemix:public:SERVICE:REGION:a/ACCOUNT:INSTANCE::
  const crn = process.env.NEXT_PUBLIC_WXO_CRN ?? "";
  const parts = crn.split(":");
  return parts[7] ?? "";
})();

// ─── IAM token ────────────────────────────────────────────────────────────────

async function getIAMToken(): Promise<string> {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(IBM_API_KEY)}`,
  });

  // Always read as text first to avoid JSON parse errors on HTML error pages
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`IBM IAM token failed (${res.status}): ${text.substring(0, 300)}`);
  }

  try {
    const data = JSON.parse(text) as { access_token?: string };
    if (!data.access_token) {
      throw new Error(`No access_token in IBM IAM response: ${text.substring(0, 200)}`);
    }
    return data.access_token;
  } catch {
    throw new Error(`IBM IAM response is not JSON (${res.status}): ${text.substring(0, 200)}`);
  }
}

// ─── Watson v2 API helpers ────────────────────────────────────────────────────

// The Watson Assistant v2 API base URL for eu-gb
// For watsonx Orchestrate, the API is on the WA backend in the same region
function getWaApiBase(): string {
  // Extract region from hostURL: https://eu-gb.watson-orchestrate.cloud.ibm.com → eu-gb
  try {
    const { hostname } = new URL(HOST_URL);
    const region = hostname.split(".")[0]; // "eu-gb"
    return `https://api.${region}.assistant.watson.cloud.ibm.com`;
  } catch {
    return "https://api.eu-gb.assistant.watson.cloud.ibm.com";
  }
}

async function createSession(token: string): Promise<string> {
  const base = getWaApiBase();
  const url = `${base}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Session create failed (${res.status}): ${text.substring(0, 300)}`);
  }

  try {
    const data = JSON.parse(text) as { session_id?: string };
    if (!data.session_id) throw new Error(`No session_id: ${text.substring(0, 200)}`);
    return data.session_id;
  } catch {
    throw new Error(`Session response not JSON (${res.status}): ${text.substring(0, 200)}`);
  }
}

async function sendMessage(
  token: string,
  sessionId: string,
  text: string
): Promise<string> {
  const base = getWaApiBase();
  const url = `${base}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions/${sessionId}/message`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: { message_type: "text", text },
      context: { global: { system: { user_id: "enterprise-os-ai" } } },
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(`Message failed (${res.status}): ${rawText.substring(0, 300)}`);
  }

  try {
    const data = JSON.parse(rawText) as {
      output?: { generic?: Array<{ response_type: string; text?: string; title?: string }> };
    };
    const parts: string[] = [];
    for (const item of data.output?.generic ?? []) {
      if (item.response_type === "text" && item.text) parts.push(item.text);
      else if (item.response_type === "option" && item.title) parts.push(item.title);
    }
    return parts.join("\n\n") || "Agent responded but no text found.";
  } catch {
    throw new Error(`Message response not JSON (${res.status}): ${rawText.substring(0, 200)}`);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── Guard: API key must be set as a server-only env var ───────────────────
  if (!IBM_API_KEY) {
    return NextResponse.json(
      {
        error: "IBM_WATSON_API_KEY is not configured on this server.",
        action:
          "Add IBM_WATSON_API_KEY (no NEXT_PUBLIC_ prefix) to Vercel → Settings → Environment Variables, then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json() as { sessionId?: string | null; text?: string };
    const { sessionId, text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: "text field is required" }, { status: 400 });
    }

    // 1. Get IBM IAM access token
    const token = await getIAMToken();

    // 2. Get or create session
    const activeSessionId = sessionId ?? await createSession(token);

    // 3. Send message and get response
    const response = await sendMessage(token, activeSessionId, text.trim());

    return NextResponse.json({ response, sessionId: activeSessionId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[watson/message]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

