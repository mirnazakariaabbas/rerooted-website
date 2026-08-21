import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Bump when the payload shape or depth of content changes so cached rows regenerate.
const SCHEMA_VERSION = 2;

const DIMENSIONS = [
  { id: "communicating", name: "Communicating", low: "Low context", high: "High context" },
  { id: "evaluating", name: "Evaluating", low: "Direct negative feedback", high: "Indirect negative feedback" },
  { id: "persuading", name: "Persuading", low: "Principles first", high: "Applications first" },
  { id: "leading", name: "Leading", low: "Egalitarian", high: "Hierarchical" },
  { id: "deciding", name: "Deciding", low: "Consensual", high: "Top-down" },
  { id: "trusting", name: "Trusting", low: "Task based", high: "Relationship based" },
  { id: "disagreeing", name: "Disagreeing", low: "Confrontational", high: "Avoids confrontation" },
  { id: "scheduling", name: "Scheduling", low: "Linear time", high: "Flexible time" },
  { id: "emotional_expression", name: "Emotional expression", low: "Reserved", high: "Expressive" },
  { id: "work_life", name: "Work-life integration", low: "Strictly separated", high: "Fully blended" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { countryA, countryB } = await req.json();
    if (!countryA || !countryB || countryA === countryB) {
      return new Response(JSON.stringify({ error: "Two different countries required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sort alphabetically for consistent caching
    const sorted = [countryA, countryB].sort();
    const dbA = sorted[0];
    const dbB = sorted[1];
    const swapped = dbA !== countryA; // true if we swapped the user's order

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check cache
    const { data: cached } = await supabaseAdmin
      .from("cultural_comparisons")
      .select("id, comparison_data")
      .eq("country_a", dbA)
      .eq("country_b", dbB)
      .maybeSingle();

    const cachedData = cached?.comparison_data as Record<string, unknown> | undefined;
    if (cachedData && cachedData.version === SCHEMA_VERSION) {
      return new Response(
        JSON.stringify({ comparison: cachedData, swapped }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dimensionList = DIMENSIONS.map(
      (d, i) => `${i + 1}. id "${d.id}" (${d.name}): 1 = ${d.low}, 10 = ${d.high}`
    ).join("\n");

    const prompt = `You are a cultural intelligence expert using the Culture Map framework by Erin Meyer, coaching a professional who is relocating from ${dbA} to ${dbB}.

Produce a deep, specific and practical comparison. Avoid generic filler, avoid stereotypes framed as absolutes, and never use em dashes.

OVERVIEW
Write 5 to 7 sentences describing this specific move: the two or three widest cultural gaps, what the first weeks typically feel like, what is commonly misread in each direction, and what tends to become easier once understood. Speak directly to the person using "you".

FOR EACH OF THE 10 DIMENSIONS BELOW, return:
- score_a: where ${dbA} sits on the 1 to 10 scale
- score_b: where ${dbB} sits on the 1 to 10 scale
- gap_explanation: 4 to 6 sentences explaining the concrete difference between ${dbA} and ${dbB} on this dimension. Name real behaviours: how meetings run, how emails are written, how disagreement surfaces, how time is treated. Explain what a person from ${dbA} typically misreads in ${dbB}, and what people in ${dbB} typically misread about them.
- tip: one specific, actionable sentence the person can apply this week.
- scenario: a real-life illustration with:
    - situation: one sentence describing a single concrete everyday situation (for example a project is running late, a colleague declines an invitation, a manager reviews poor work). Use the SAME situation for both countries.
    - dialogue_a: 3 to 5 turns showing how that exact conversation typically sounds in ${dbA}. Each turn has "speaker" (a first name plus a short role, for example "Layla, team lead") and "line" (natural spoken language, not narration).
    - dialogue_b: 3 to 5 turns showing the same conversation in ${dbB}, with different names appropriate to that country.
    - contrast: 2 sentences naming exactly what changed between the two versions and what an outsider would miss.

Dimensions and scales:
${dimensionList}

Use exactly these ids, in this order.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a cultural intelligence expert. Return structured data only via the provided tool." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "cultural_comparison",
              description: "Return an in-depth cultural comparison between two countries",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "5 to 7 sentence overview of this specific move" },
                  dimensions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        score_a: { type: "number" },
                        score_b: { type: "number" },
                        gap_explanation: { type: "string" },
                        tip: { type: "string" },
                        scenario: {
                          type: "object",
                          properties: {
                            situation: { type: "string" },
                            dialogue_a: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  speaker: { type: "string" },
                                  line: { type: "string" },
                                },
                                required: ["speaker", "line"],
                                additionalProperties: false,
                              },
                            },
                            dialogue_b: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  speaker: { type: "string" },
                                  line: { type: "string" },
                                },
                                required: ["speaker", "line"],
                                additionalProperties: false,
                              },
                            },
                            contrast: { type: "string" },
                          },
                          required: ["situation", "dialogue_a", "dialogue_b", "contrast"],
                          additionalProperties: false,
                        },
                      },
                      required: ["id", "score_a", "score_b", "gap_explanation", "tip", "scenario"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "dimensions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "cultural_comparison" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const text = await aiResponse.text();
      console.error("AI gateway error:", status, text);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in AI response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "AI returned unexpected format" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    // Normalise: keep the canonical dimension order, names and scale labels server side.
    const byId = new Map<string, any>((parsed.dimensions || []).map((d: any) => [d.id, d]));
    const dimensions = DIMENSIONS.map((d) => {
      const src = byId.get(d.id) || {};
      return {
        id: d.id,
        name: d.name,
        scale_low: d.low,
        scale_high: d.high,
        score_a: typeof src.score_a === "number" ? src.score_a : 5,
        score_b: typeof src.score_b === "number" ? src.score_b : 5,
        explanation: src.gap_explanation || "",
        tip: src.tip || "",
        scenario: src.scenario || null,
      };
    });

    const comparisonData = {
      version: SCHEMA_VERSION,
      summary: parsed.summary || "",
      dimensions,
    };

    // Cache in DB (replace any stale version)
    if (cached?.id) {
      await supabaseAdmin
        .from("cultural_comparisons")
        .update({ comparison_data: comparisonData })
        .eq("id", cached.id);
    } else {
      await supabaseAdmin.from("cultural_comparisons").insert({
        country_a: dbA,
        country_b: dbB,
        comparison_data: comparisonData,
      });
    }

    return new Response(
      JSON.stringify({ comparison: comparisonData, swapped }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("cultural-comparison error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
