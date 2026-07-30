import { NextResponse } from "next/server";

const HOST_URL            = process.env.NEXT_PUBLIC_WXO_HOST_URL ?? "";
const AGENT_ID            = process.env.NEXT_PUBLIC_WXO_AGENT_ID ?? "";
const IBM_API_KEY         = process.env.IBM_WATSON_API_KEY ?? "";
const SERVICE_INSTANCE_ID = (() => {
  const crn = process.env.NEXT_PUBLIC_WXO_CRN ?? "";
  return crn.split(":")[7] ?? "";
})();

async function getIAMToken(): Promise<string> {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(IBM_API_KEY)}`,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`IBM IAM failed (${res.status}): ${text.substring(0, 300)}`);
  try {
    const data = JSON.parse(text) as { access_token?: string };
    if (!data.access_token) throw new Error(`No access_token: ${text.substring(0, 200)}`);
    return data.access_token;
  } catch {
    throw new Error(`IAM not JSON (${res.status}): ${text.substring(0, 200)}`);
  }
}

async function tryFetch(url: string, token: string, body: Record<string, unknown>): Promise<{ ok: boolean; text: string; status: number }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, text, status: res.status };
}

async function createSession(token: string): Promise<{ sessionId: string; baseUrl: string }> {
  const candidates = [
    `${HOST_URL}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions`,
    `${HOST_URL}/v1/agents/${AGENT_ID}/sessions`,
    `https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions`,
  ];

  const errors: string[] = [];
  for (const url of candidates) {
    const { ok, text, status } = await tryFetch(url, token, {});
    if (ok) {
      try {
        const data = JSON.parse(text) as { session_id?: string };
        if (data.session_id) return { sessionId: data.session_id, baseUrl: url };
      } catch { /* continue */ }
    }
    errors.push(`${url} (${status}): ${text.substring(0, 100)}`);
  }
  throw new Error(`All session endpoints 404/failed:\n${errors.join("\n")}`);
}

async function sendMessage(token: string, sessionId: string, text: string, sessionBaseUrl: string): Promise<string> {
  const msgUrl = `${sessionBaseUrl}/${sessionId}/message`;
  const { ok, text: raw, status } = await tryFetch(msgUrl, token, {
    input: { message_type: "text", text },
    context: { global: { system: { user_id: "enterprise-os-ai" } } },
  });
  if (!ok) throw new Error(`Message failed (${status}): ${raw.substring(0, 300)}`);
  try {
    const data = JSON.parse(raw) as { output?: { generic?: Array<{ response_type: string; text?: string }> } };
    const parts = (data.output?.generic ?? [])
      .filter(i => i.response_type === "text" && i.text)
      .map(i => i.text!);
    return parts.join("\n\n") || "Agent responded but no text content.";
  } catch {
    throw new Error(`Message response not JSON (${status}): ${raw.substring(0, 200)}`);
  }
}

export async function POST(request: Request) {
  if (!IBM_API_KEY) {
    return NextResponse.json({
      error: "IBM_WATSON_API_KEY not configured on server.",
      action: "Add IBM_WATSON_API_KEY (no NEXT_PUBLIC_) to Vercel → Settings → Environment Variables, then redeploy.",
    }, { status: 503 });
  }

  try {
    const body = await request.json() as { sessionId?: string | null; text?: string; sessionBaseUrl?: string };
    const { text, sessionId, sessionBaseUrl } = body;
    if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

    const token = await getIAMToken();
    let activeSessionId = sessionId ?? null;
    let activeBaseUrl = sessionBaseUrl ?? null;

    if (!activeSessionId) {
      const { sessionId: newId, baseUrl } = await createSession(token);
      activeSessionId = newId;
      activeBaseUrl = baseUrl;
    }

    const response = await sendMessage(token, activeSessionId, text.trim(), activeBaseUrl!);
    return NextResponse.json({ response, sessionId: activeSessionId, sessionBaseUrl: activeBaseUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[watson/message]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}