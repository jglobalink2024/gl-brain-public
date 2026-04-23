// brain-relay Edge Function
// [PERSISTENT]
// Receives GitHub push webhooks and stores latest brain file state in Supabase.
// Deploy to: gl-brain, pl-brain, hearth-brain Supabase projects.
// Each deployment is identical — BRAIN_ID env var identifies which brain it serves.
//
// Webhook source: GitHub → Settings → Webhooks → Content type: application/json
// Secret: GITHUB_WEBHOOK_SECRET (set in Supabase Edge Function secrets)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BRAIN_ID = Deno.env.get("BRAIN_ID") ?? "unknown";
const WEBHOOK_SECRET = Deno.env.get("GITHUB_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const hex = "sha256=" + Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === signature;
}

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();

  // Verify GitHub webhook signature
  if (WEBHOOK_SECRET) {
    const signature = req.headers.get("x-hub-signature-256") ?? "";
    const valid = await verifySignature(WEBHOOK_SECRET, body, signature);
    if (!valid) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const event = req.headers.get("x-github-event") ?? "";

  // Only process push events
  if (event !== "push") {
    return new Response(JSON.stringify({ ok: true, skipped: true, event }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Log the commit to brain_commits
  const commits = (payload.commits as Array<{
    id: string;
    message: string;
    timestamp: string;
    added: string[];
    modified: string[];
    removed: string[];
    author: { name: string; email: string };
  }>) ?? [];

  const commitRows = commits.map((c) => ({
    brain_id: BRAIN_ID,
    commit_sha: c.id,
    message: c.message,
    author_name: c.author?.name ?? "",
    author_email: c.author?.email ?? "",
    committed_at: c.timestamp,
    files_added: c.added ?? [],
    files_modified: c.modified ?? [],
    files_removed: c.removed ?? [],
    raw_payload: c,
  }));

  if (commitRows.length > 0) {
    const { error: commitError } = await supabase
      .from("brain_commits")
      .insert(commitRows);

    if (commitError) {
      console.error("brain_commits insert error:", commitError);
      return new Response(JSON.stringify({ ok: false, error: commitError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Update brain_state with latest push metadata
  const { error: stateError } = await supabase
    .from("brain_state")
    .upsert({
      brain_id: BRAIN_ID,
      last_commit_sha: payload.after as string,
      last_commit_message: commits[commits.length - 1]?.message ?? "",
      last_pushed_at: new Date().toISOString(),
      ref: payload.ref as string,
      pusher: (payload.pusher as { name: string })?.name ?? "",
    }, { onConflict: "brain_id" });

  if (stateError) {
    console.error("brain_state upsert error:", stateError);
    return new Response(JSON.stringify({ ok: false, error: stateError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[${BRAIN_ID}] Processed ${commits.length} commit(s) — ${payload.after}`);

  return new Response(
    JSON.stringify({ ok: true, brain_id: BRAIN_ID, commits: commits.length }),
    { headers: { "Content-Type": "application/json" } },
  );
});
