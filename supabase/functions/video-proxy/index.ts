const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let url: string | null = null;

    // Accept URL in body (POST) or query param (GET-style streaming)
    if (req.method === "POST") {
      const body = await req.json();
      url = body?.url ?? null;
    } else {
      const u = new URL(req.url);
      url = u.searchParams.get("url");
    }

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'url' parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[video-proxy] Proxying video: ${url}`);

    // Fetch the upstream video
    const upstreamRes = await fetch(url, {
      headers: {
        // Forward range header for seeking support
        Range: req.headers.get("Range") || "",
      },
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      console.error(`[video-proxy] Upstream returned ${upstreamRes.status}`);
      return new Response(
        JSON.stringify({ error: `Upstream returned ${upstreamRes.status}` }),
        { status: upstreamRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream response back with CORS headers
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", upstreamRes.headers.get("Content-Type") || "video/mp4");
    const contentLength = upstreamRes.headers.get("Content-Length");
    if (contentLength) headers.set("Content-Length", contentLength);
    const contentRange = upstreamRes.headers.get("Content-Range");
    if (contentRange) headers.set("Content-Range", contentRange);
    headers.set("Accept-Ranges", "bytes");

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers,
    });
  } catch (err) {
    console.error("[video-proxy] Error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
