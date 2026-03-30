import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { countryFrom, countryTo } = await req.json();
    if (!countryFrom || !countryTo) {
      return new Response(JSON.stringify({ error: "Missing countryFrom or countryTo" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const topicPools = [
      "greetings and personal space norms",
      "dining etiquette and food culture",
      "workplace hierarchy and meeting styles",
      "punctuality and time perception",
      "gift-giving customs",
      "public transport etiquette",
      "neighborhood and community interaction",
      "holidays and celebrations",
      "dress code expectations",
      "humor and conversation taboos",
      "bureaucracy and paperwork culture",
      "shopping and bargaining norms",
      "family roles and expectations",
      "noise levels and quiet hours",
      "tipping and service culture",
      "small talk topics to avoid or embrace",
      "weekend and leisure culture",
      "healthcare system navigation",
      "banking and financial norms",
      "landlord and tenant customs",
    ];
    const shuffled = topicPools.sort(() => Math.random() - 0.5);
    const focusTopics = shuffled.slice(0, 3).join(", ");
    const seed = Math.floor(Math.random() * 100000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a cross-cultural expert specializing in expat relocation. Only provide tips that are well-documented cultural facts — never guess or speculate. Each tip must reflect real, verifiable cultural norms. Be warm, specific, and actionable.`,
          },
          {
            role: "user",
            content: `[Seed: ${seed}] Give me 3 practical, fact-based cultural tips for someone who moved from ${countryFrom} to ${countryTo}. Focus specifically on these topics: ${focusTopics}. For each tip provide a short title and a 2-3 sentence explanation grounded in real cultural practices. Do NOT repeat generic advice.`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_tips",
            description: "Provide cultural tips for expat relocation",
            parameters: {
              type: "object",
              properties: {
                tips: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      explanation: { type: "string" },
                      category: { type: "string", enum: ["daily_life", "social", "workplace"] },
                    },
                    required: ["title", "explanation", "category"],
                  },
                },
              },
              required: ["tips"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_tips" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("cultural-tips error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
