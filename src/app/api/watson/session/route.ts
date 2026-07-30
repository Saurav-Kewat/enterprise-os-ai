/**
 * /api/watson/session — create or reuse a WXO session
 *
 * POST body: {}
 * Returns:   { sessionId: string }
 *
 * IBM WXO session endpoint:
 *   POST {hostURL}/v2/assistants/{agentId}/sessions
 *   Authorization: Bearer {iam_token}
 *
 * IAM token endpoint:
 *   POST https://iam.cloud.ibm.com/identity/token
 *   Body: grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={API_KEY}
 */

import { NextResponse } from "next/server";

const HOST_URL           = process.env.NEXT_PUBLIC_WXO_HOST_URL ?? "";
const AGENT_ID           = process.env.NEXT_PUBLIC_WXO_AGENT_ID ?? "";
const IBM_API_KEY        = process.env.IBM_WATSON_API_KEY ?? "";  // server-only (no NEXT_PUBLIC_)
const SERVICE_INSTANCE_ID = (() => {
  // Extract instance GUID from CRN
  const crn = process.env.NEXT_PUBLIC_WXO_CRN ?? "";
  return crn.split(":")[7] ?? "";
})();

async function getIAMToken(): Promise<string> {
  if (!IBM_API_KEY) throw new Error("IBM_WATSON_API_KEY is not set in server env vars");

  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(IBM_API_KEY)}`,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IAM token request failed ${res.status}: ${text.substring(0, 200)}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function POST() {
  try {
    if (!IBM_API_KEY) {
      return NextResponse.json(
        { error: "IBM_WATSON_API_KEY not configured. Add it to Vercel environment variables." },
        { status: 503 }
      );
    }

    const token = await getIAMToken();

    // Create a new WXO session
    const sessionRes = await fetch(
      `${HOST_URL}/instances/${SERVICE_INSTANCE_ID}/v2/assistants/${AGENT_ID}/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!sessionRes.ok) {
      const text = await sessionRes.text();
      return NextResponse.json(
        { error: `Session creation failed ${sessionRes.status}: ${text.substring(0, 200)}` },
        { status: sessionRes.status }
      );
    }

    const sessionData = await sessionRes.json();
    return NextResponse.json({ sessionId: sessionData.session_id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
