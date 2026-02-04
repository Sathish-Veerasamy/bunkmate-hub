const TARGET_API_URL = Deno.env.get("EXTERNAL_API_URL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, method, body, token } = await req.json();

    // Basic validation for the endpoint path
    if (!endpoint || !endpoint.startsWith("/") || endpoint.includes("..")) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid endpoint path" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token is provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const targetUrl = `${TARGET_API_URL}/api/v3${endpoint}`;
    console.log(`Proxying request to: ${targetUrl}`);

    // Make the request from the server-side Edge Function
    const response = await fetch(targetUrl, {
      method: method || "GET",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Edge Function Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
