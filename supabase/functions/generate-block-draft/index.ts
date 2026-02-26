import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sectionNumber, exercisesData, protagonistData, block } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from exercises
    // For section 8, filter out empty founder 3 fields
    const exercisesSummary = Object.entries(exercisesData as Record<string, Record<string, string>>)
      .map(([exerciseId, fields]) => {
        let filteredFields = Object.entries(fields)
          .filter(([_, v]) => v && v.trim().length > 0);

        // If section 8, check if founder 3 is empty and exclude those fields
        if (sectionNumber === 8) {
          const f3Name = fields["fundador_3_nombre"]?.trim();
          const f3Exp = fields["fundador_3_experiencia"]?.trim();
          if (!f3Name && !f3Exp) {
            filteredFields = filteredFields.filter(([k]) => !k.startsWith("fundador_3"));
          }
        }

        const filledFields = filteredFields
          .map(([k, v]) => `  - ${k}: ${v}`)
          .join("\n");
        return filledFields ? `Ejercicio ${exerciseId}:\n${filledFields}` : null;
      })
      .filter(Boolean)
      .join("\n\n");

    let protagonistSummary = "";
    if (protagonistData) {
      const p = protagonistData as Record<string, string>;
      protagonistSummary = Object.entries(p)
        .filter(([_, v]) => v && v.trim().length > 0)
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join("\n");
      if (protagonistSummary) {
        protagonistSummary = `\nProtagonista:\n${protagonistSummary}`;
      }
    }

    const systemPrompt = `Eres un coach de pitch de inversión experto. Tu trabajo es redactar el borrador de UN bloque del pitch basándote en los datos que el usuario preparó en ejercicios previos.

REGLAS ABSOLUTAS (INCUMPLIR CUALQUIERA = RESPUESTA RECHAZADA):
1. LÍMITE DE PALABRAS ESTRICTO: El texto DEBE tener ENTRE ${block.palabrasMin} Y ${block.palabrasMax} PALABRAS. CUENTA CADA PALABRA ANTES DE RESPONDER. Si tu borrador tiene más de ${block.palabrasMax} palabras, RECÓRTALO. Si tiene menos de ${block.palabrasMin}, AMPLÍALO. VERIFICA EL CONTEO FINAL.
2. DEBE cumplir TODAS estas restricciones: ${JSON.stringify(block.restricciones)}
3. PROHIBIDO usar cualquiera de estos elementos: ${JSON.stringify(block.prohibido)}
4. Sigue esta estructura:
${block.estructura.map((s: { titulo: string; descripcion: string }) => `   - ${s.titulo}: ${s.descripcion}`).join("\n")}

5. Usa español latinoamericano natural, directo, sin florituras.
6. NO inventes datos. Solo usa la información proporcionada por el usuario.
7. NO agregues encabezados, títulos ni etiquetas de sección. Solo el texto narrativo corrido.
8. Responde ÚNICAMENTE con el texto del bloque. Sin explicaciones, sin comentarios, sin meta-texto, sin conteo de palabras.
9. PRIORIDAD MÁXIMA: Mantener el texto entre ${block.palabrasMin}-${block.palabrasMax} palabras. Sé conciso. Elimina redundancias. Cada palabra debe aportar valor.

EJEMPLO DE REFERENCIA (para que entiendas el tono y estilo, NO lo copies):
${block.ejemplo}`;

    const userPrompt = `Redacta el bloque "${block.nombre}" (${block.palabrasMin}-${block.palabrasMax} palabras) usando estos datos:

${exercisesSummary}
${protagonistSummary}

Recuerda: entre ${block.palabrasMin} y ${block.palabrasMax} palabras exactas. Solo texto narrativo.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Agrega créditos en tu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const draft = data.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ draft }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
