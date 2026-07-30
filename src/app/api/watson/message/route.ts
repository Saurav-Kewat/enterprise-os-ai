/**
 * /api/watson/message — send a message to the IBM WXO agent and return the response
 *
 * POST body:  { sessionId: string, text: string }
 * Returns:    { response: string, sessionId: string }
 *
 * IBM WXO message endpoint:
 *   POST {hostURL}/instances/{instanceId}/v2/assistants/{agentId}/sessions/{sessionId}/message
 *   Authorization: Bearer {iam_token}
 */

import { NextResponse } from "next/server";

const HOST_URL            = process.env.NEXT_PUBLIC_WXO_HOST_URL ?? "";
const AGENT_ID            = process.env.NEXT_PUBLIC_WXO_AGENT_ID ?? "";
const IBM_API_KEY         = process.env.IBM_WATSON_API_KEY ?? "";
const SERVICE_INSTANCE_ID = (() => {
  const crn = process.env.NEXT_PUBLIC_WXO_CRN ?? "";
  return crn.split(":")[7] ?? "";
})();

async function getIAMToken(): Promise<string> {
  if (!IBM_API_KEY) throw new Error("IBM_WATSON_API_KEY is not set");
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(IBM_API_KEY)}`,
  });
  if (!res.ok) throw new Error(`IAM token failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, text } = body as { sessionId?: string; text?: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!IBM_API_KEY) {
      return NextResponse.json(
        {
          error: "IBM_WATSON_API_KEY not configured.",
          hint: "Add IBM_WATSON_API_KEY to Vercel environment variables (no NEXT_PUBLIC_ prefix — server-only).",
        },
        { status: 503 }
      );
    }

    const token = await getIAMToken();

    // Create session if not provided
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const sRes = await fetch(
        `${HOST_URL}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      if (!sRes.ok) {
        const t = await sRes.text();
        return NextResponse.json({ error: `Session create failed: ${t.substring(0, 200)}` }, { status: sRes.status });
      }
      const sd = await sRes.json();
      activeSessionId = sd.session_id as string;
    }

    // Send message
    const msgRes = await fetch(
      `${HOST_URL}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions/${activeSessionId}/message`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text, message_type: "text" },
          context: { global: { system: { user_id: "enterprise-os-ai" } } },
        }),
      }
    );

    if (!msgRes.ok) {
      const t = await msgRes.text();
      return NextResponse.json({ error: `Message send failed: ${t.substring(0, 300)}` }, { status: msgRes.status });
    }

    const msgData = await msgRes.json();

    // Extract text responses from the IBM response structure
    const responses: string[] = [];
    const outputs = msgData?.output?.generic ?? [];
    for (const item of outputs) {
      if (item.response_type === "text" && item.text) {
        responses.push(item.text);
      } else if (item.response_type === "option" && item.title) {
        responses.push(item.title);
      }
    }

    const responseText = responses.join("\n\n") || "No response from agent.";

    return NextResponse.json({
      response: responseText,
      sessionId: activeSessionId,
      raw: msgData,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
