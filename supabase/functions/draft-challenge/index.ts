import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { topic, level = 1, notes = "" } = await req.json();
    const apiKey = (Deno.env.get("GEMINI_API_KEYS") || "").split(",")[0].trim();
    const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";

    const prompt = `Create an HTML/CSS coding challenge in Uzbek (Latin script) for topic "${topic}", level ${level} (1-3). Extra notes: "${notes}".
Return strict JSON with keys:
{
  "title": string,
  "description_md": string,
  "level": number,
  "topics": string[],
  "starter_html": string,
  "starter_css": string,
  "solution_html": string,
  "solution_css": string,
  "tests": [
    { "type": "exists"|"count"|"text"|"style"|"attr", "selector": string, "property"?: string, "op"?: string, "value"?: any, "contains"?: string, "label": string }
  ],
  "fallback_hints": { "1": string, "2": string, "3": string, "4": string }
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
        }),
      }
    );

    const data = await res.json();
    const draft = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");

    return new Response(JSON.stringify(draft), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
