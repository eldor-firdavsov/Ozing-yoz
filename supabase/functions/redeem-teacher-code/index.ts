import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error("Avtorizatsiya xatosi");

    const { code } = await req.json();
    const cleanCode = String(code || "").trim().toUpperCase();
    const masterCode = Deno.env.get("TEACHER_MASTER_CODE") || "USTOZ2026";

    if (cleanCode !== masterCode) {
      const { data: invite } = await admin
        .from("teacher_invites")
        .select("*")
        .eq("code", cleanCode)
        .is("used_by", null)
        .single();

      if (!invite) throw new Error("Ustoz taklif kodi noto'g'ri yoki ishlatilgan");

      await admin
        .from("teacher_invites")
        .update({ used_by: user.id, used_at: new Date().toISOString() })
        .eq("code", cleanCode);
    }

    await admin.from("profiles").update({ role: "teacher" }).eq("id", user.id);

    return new Response(JSON.stringify({ ok: true, role: "teacher" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
