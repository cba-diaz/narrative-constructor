import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sectionNumber, exercisesData, protagonistData, block } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from exercises
    const exercisesSummary = Object.entries(exercisesData as Record<string, Record<string, string>>)
      .map(([exerciseId, fields]) => {
        const filledFields = Object.entries(fields)
          .filter(([_, v]) => v && v.trim().length > 0)
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

REGLAS ABSOLUTAS:
1. El texto DEBE tener entre ${block.palabrasMin} y ${block.palabrasMax} palabras. NI UNA MENOS, NI UNA MÁS. Cuenta las palabras antes de responder.
2. DEBE cumplir TODAS estas restricciones: ${JSON.stringify(block.restricciones)}
3. PROHIBIDO usar cualquiera de estos elementos: ${JSON.stringify(block.prohibido)}
4. Sigue esta estructura:
${block.estructura.map((s: { titulo: string; descripcion: string }) => `   - ${s.titulo}: ${s.descripcion}`).join("\n")}

5. Usa español latinoamericano natural, directo, sin florituras.
6. NO inventes datos. Solo usa la información proporcionada por el usuario.
7. NO agregues encabezados, títulos ni etiquetas de sección. Solo el texto narrativo corrido.
8. Responde ÚNICAMENTE con el texto del bloque. Sin explicaciones, sin comentarios, sin meta-texto.

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
        max_tokens: 500,
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
