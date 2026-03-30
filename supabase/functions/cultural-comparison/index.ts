import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      .select("comparison_data")
      .eq("country_a", dbA)
      .eq("country_b", dbB)
      .maybeSingle();

    if (cached) {
      return new Response(
        JSON.stringify({ comparison: cached.comparison_data, swapped }),
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

    const prompt = `You are a cultural intelligence expert using the Culture Map framework by Erin Meyer.

For a professional relocating from ${dbA} to ${dbB}, provide a cultural comparison across all 8 Culture Map dimensions plus 2 additional dimensions.

For each dimension, return:
- A score for ${dbA} from 1-10 on the dimension scale
- A score for ${dbB} from 1-10 on the dimension scale
- A 2-sentence practical explanation written directly to the expat (use "you" / "your")
- A one-sentence actionable tip

Dimensions and their scales:
1. Communicating: 1=Low context, 10=High context
2. Evaluating: 1=Direct negative feedback, 10=Indirect negative feedback
3. Persuading: 1=Principles-first, 10=Applications-first
4. Leading: 1=Egalitarian, 10=Hierarchical
5. Deciding: 1=Consensual, 10=Top-down
6. Trusting: 1=Task-based, 10=Relationship-based
7. Disagreeing: 1=Confrontational, 10=Avoids confrontation
8. Scheduling: 1=Linear-time, 10=Flexible-time
9. Emotional Expression: 1=Reserved/private, 10=Open/expressive
10. Work-Life Integration: 1=Strictly separated, 10=Fully blended

Also return a 3-sentence overall summary describing the biggest cultural shifts this person will encounter.`;

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
              description: "Return a cultural comparison between two countries",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "3-sentence overview of biggest cultural shifts" },
                  dimensions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        scale_low: { type: "string" },
                        scale_high: { type: "string" },
                        score_a: { type: "number" },
                        score_b: { type: "number" },
                        explanation: { type: "string" },
                        tip: { type: "string" },
                      },
                      required: ["id", "name", "scale_low", "scale_high", "score_a", "score_b", "explanation", "tip"],
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

    const comparisonData = JSON.parse(toolCall.function.arguments);

    // Cache in DB
    await supabaseAdmin.from("cultural_comparisons").insert({
      country_a: dbA,
      country_b: dbB,
      comparison_data: comparisonData,
    });

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
