import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Item = {
  phase: "laying-the-ground" | "tending-the-garden" | "starting-to-bloom";
  category: "admin" | "daily-life" | "family" | "social" | "emotional";
  title: string;
  description: string;
  is_family_only: boolean;
  is_partner_only: boolean;
  sort_order: number;
};

const FALLBACK: Item[] = [
  // Phase 1
  { phase: "laying-the-ground", category: "admin", title: "Register with local authorities", description: "Find the local residents' office and bring your passport, lease, and any required forms.", is_family_only: false, is_partner_only: false, sort_order: 10 },
  { phase: "laying-the-ground", category: "admin", title: "Open a local bank account", description: "Compare a couple of local banks. Most will need proof of address and ID.", is_family_only: false, is_partner_only: false, sort_order: 20 },
  { phase: "laying-the-ground", category: "admin", title: "Activate health insurance", description: "Confirm what coverage starts when, and keep digital copies of your cards.", is_family_only: false, is_partner_only: false, sort_order: 30 },
  { phase: "laying-the-ground", category: "admin", title: "Get a local phone number and SIM", description: "A local number makes appointments, deliveries, and banking much simpler.", is_family_only: false, is_partner_only: false, sort_order: 40 },
  { phase: "laying-the-ground", category: "family", title: "Enrol your children in school or daycare", description: "Visit options in person if you can. Ask about language support for newcomers.", is_family_only: true, is_partner_only: false, sort_order: 50 },
  { phase: "laying-the-ground", category: "daily-life", title: "Set up home internet and utilities", description: "Confirm what's already included, and what you need to set up directly.", is_family_only: false, is_partner_only: false, sort_order: 60 },
  { phase: "laying-the-ground", category: "admin", title: "Note local emergency numbers", description: "Save the numbers for police, ambulance, and fire in your phone.", is_family_only: false, is_partner_only: false, sort_order: 70 },
  { phase: "laying-the-ground", category: "daily-life", title: "Sort out local transport", description: "A transit pass, a bike, or a local driving licence, whichever fits your life.", is_family_only: false, is_partner_only: false, sort_order: 80 },
  { phase: "laying-the-ground", category: "admin", title: "Register with your embassy or consulate", description: "A quick online registration keeps you on their list in case of emergency.", is_family_only: false, is_partner_only: false, sort_order: 90 },

  // Phase 2
  { phase: "tending-the-garden", category: "daily-life", title: "Find a GP or family doctor", description: "Ideally one who speaks a language you're comfortable in.", is_family_only: false, is_partner_only: false, sort_order: 10 },
  { phase: "tending-the-garden", category: "daily-life", title: "Find your local grocery stores", description: "Notice opening hours, payment habits, and what's seasonal.", is_family_only: false, is_partner_only: false, sort_order: 20 },
  { phase: "tending-the-garden", category: "daily-life", title: "Understand waste and recycling rules", description: "These differ a lot by neighbourhood. Ask a neighbour if it's confusing.", is_family_only: false, is_partner_only: false, sort_order: 30 },
  { phase: "tending-the-garden", category: "family", title: "Find a paediatrician", description: "Ask other parents for trusted recommendations.", is_family_only: true, is_partner_only: false, sort_order: 40 },
  { phase: "tending-the-garden", category: "family", title: "Map nearby parks and family spaces", description: "Knowing two or three reliable outdoor spots makes weekends easier.", is_family_only: true, is_partner_only: false, sort_order: 50 },
  { phase: "tending-the-garden", category: "family", title: "Connect with a local parent group", description: "Look for expat parent meetups or local community centres.", is_family_only: true, is_partner_only: false, sort_order: 60 },
  { phase: "tending-the-garden", category: "daily-life", title: "Find a gym or regular movement habit", description: "A class, a club, a running route. Something repeatable.", is_family_only: false, is_partner_only: false, sort_order: 70 },
  { phase: "tending-the-garden", category: "daily-life", title: "Settle into your commute", description: "Try it at the times you'll actually do it. Adjust as needed.", is_family_only: false, is_partner_only: false, sort_order: 80 },
  { phase: "tending-the-garden", category: "social", title: "Learn 10 essential phrases", description: "Hello, thank you, sorry, please, and a few you'll use weekly.", is_family_only: false, is_partner_only: false, sort_order: 90 },
  { phase: "tending-the-garden", category: "daily-life", title: "Find your neighbourhood café or spot", description: "A place where the staff start to recognise you.", is_family_only: false, is_partner_only: false, sort_order: 100 },

  // Phase 3
  { phase: "starting-to-bloom", category: "social", title: "Join one activity that's just for you", description: "Not work, not logistics. Something you'd choose anywhere.", is_family_only: false, is_partner_only: false, sort_order: 10 },
  { phase: "starting-to-bloom", category: "social", title: "Have a real conversation with a neighbour", description: "Beyond a polite hello. Even three minutes counts.", is_family_only: false, is_partner_only: false, sort_order: 20 },
  { phase: "starting-to-bloom", category: "emotional", title: "Explore a new part of your city", description: "Wander a neighbourhood you haven't walked through yet.", is_family_only: false, is_partner_only: false, sort_order: 30 },
  { phase: "starting-to-bloom", category: "emotional", title: "Find a cultural or spiritual community", description: "Only if it matters to you. A bookshop, a temple, a choir, a club.", is_family_only: false, is_partner_only: false, sort_order: 40 },
  { phase: "starting-to-bloom", category: "social", title: "Invite someone for coffee", description: "A colleague, a parent, a neighbour. The first invite is the hardest.", is_family_only: false, is_partner_only: false, sort_order: 50 },
  { phase: "starting-to-bloom", category: "emotional", title: "Identify a place that feels calm", description: "Somewhere you can go when everything else feels unfamiliar.", is_family_only: false, is_partner_only: false, sort_order: 60 },
  { phase: "starting-to-bloom", category: "daily-life", title: "Cook a local dish at home", description: "Pick a recipe with ingredients from your local market.", is_family_only: false, is_partner_only: false, sort_order: 70 },
  { phase: "starting-to-bloom", category: "emotional", title: "Write down three things you appreciate", description: "About this place, today. Small details count.", is_family_only: false, is_partner_only: false, sort_order: 80 },
  { phase: "starting-to-bloom", category: "social", title: "Build a friendship outside your nationality", description: "Roots grow deeper when they reach beyond familiar soil.", is_family_only: false, is_partner_only: false, sort_order: 90 },
  { phase: "starting-to-bloom", category: "emotional", title: "Plan something to look forward to", description: "A weekend trip, a class, a dinner. One thing in the next month.", is_family_only: false, is_partner_only: false, sort_order: 100 },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const countryTo = String(body.countryTo || "").trim();
    const familySetup = String(body.familySetup || "alone");
    const hasChildren = Boolean(body.hasChildren);
    const priorities: string[] = Array.isArray(body.priorities) ? body.priorities : [];

    if (!countryTo) {
      return new Response(JSON.stringify({ items: FALLBACK }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ items: FALLBACK }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a relocation advisor helping an expatriate settle into ${countryTo}.

Rules:
1. Be specific to ${countryTo}. Name actual institutions, processes, and local details. For example, for Switzerland say "Register at the Einwohnerkontrolle" not "Register with local authorities."
2. Keep item titles short (under 10 words). Put specific details in the description.
3. Tone: warm, practical, calm. Never use warning language, urgency, or exclamation marks.
4. For each item, include a brief description with one or two practical tips specific to ${countryTo}.
5. Do not include items about flights, shipping, or the physical move itself.
6. Cover all three phases: laying-the-ground (essentials), tending-the-garden (daily life), starting-to-bloom (connection and belonging).
7. Family items only when relevant. Aim for around 25 to 30 items total across phases.`;

    const userPrompt = `Generate a personalised settling-in checklist for someone moving to ${countryTo}.
Family setup: ${familySetup}. Has children: ${hasChildren ? "yes" : "no"}.
Their stated priorities: ${priorities.length ? priorities.join(", ") : "no specific priorities"}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_checklist",
            description: "Return personalised settling-in checklist items",
            parameters: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      phase: { type: "string", enum: ["laying-the-ground", "tending-the-garden", "starting-to-bloom"] },
                      category: { type: "string", enum: ["admin", "daily-life", "family", "social", "emotional"] },
                      title: { type: "string" },
                      description: { type: "string" },
                      is_family_only: { type: "boolean" },
                      is_partner_only: { type: "boolean" },
                      sort_order: { type: "integer" },
                    },
                    required: ["phase", "category", "title", "description", "is_family_only", "is_partner_only", "sort_order"],
                  },
                },
              },
              required: ["items"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_checklist" } },
      }),
    });

    if (!response.ok) {
      console.warn("settling-checklist AI failure", response.status);
      return new Response(JSON.stringify({ items: FALLBACK, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ items: FALLBACK, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    const items: Item[] = Array.isArray(parsed.items) && parsed.items.length ? parsed.items : FALLBACK;

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("settling-checklist error:", e);
    return new Response(JSON.stringify({ items: FALLBACK, fallback: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
