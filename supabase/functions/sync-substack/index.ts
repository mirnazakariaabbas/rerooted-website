import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.4.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FEED_URL = "https://yasserabbas.substack.com/feed";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractFirstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function slugFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const res = await fetch(FEED_URL, { headers: { "User-Agent": "Mozilla/5.0 ReRootedBot" } });
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item ?? [];
    const itemList = Array.isArray(items) ? items : [items];

    let inserted = 0;
    let updated = 0;

    for (const item of itemList) {
      if (!item) continue;
      const title: string = typeof item.title === "string" ? item.title : item.title?.["#text"] ?? "";
      const link: string = typeof item.link === "string" ? item.link : item.link?.["#text"] ?? "";
      if (!title || !link) continue;

      const contentEncoded: string =
        item["content:encoded"] ?? item.content ?? item.description ?? "";
      const description: string = item.description ?? "";
      const pubDate: string = item.pubDate ?? new Date().toISOString();

      const enclosureUrl: string | undefined = item.enclosure?.["@_url"];
      const cover = enclosureUrl || extractFirstImage(contentEncoded) || extractFirstImage(description);

      const excerpt = stripHtml(description || contentEncoded).slice(0, 220);
      const slug = slugFromUrl(link);

      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("source_url", link)
        .maybeSingle();

      const payload = {
        title,
        slug,
        excerpt,
        body_html: contentEncoded,
        cover_image_url: cover,
        category: "Substack",
        status: "published",
        published_at: new Date(pubDate).toISOString(),
        source: "substack",
        source_url: link,
        external_url: link,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", existing.id);
        if (error) throw error;
        updated++;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        inserted++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted, updated, total: itemList.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("sync-substack error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
