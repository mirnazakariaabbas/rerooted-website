import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  external_url: string | null;
}

const fallbackPosts = [
  {
    id: "f1",
    title: "The Re-Rooted® Compass: 5 Questions to Ask Before You Move Abroad",
    excerpt:
      "Before the visa and the packing list, there are questions that will shape your entire experience.",
    category: "Values",
    cover_image_url: null,
    slug: "#",
    external_url: null,
  },
  {
    id: "f2",
    title: "What Nobody Tells You About the First 90 Days",
    excerpt:
      "The honeymoon ends. The loneliness begins. Here's what actually happens in the first three months.",
    category: "Purpose",
    cover_image_url: null,
    slug: "#",
    external_url: null,
  },
  {
    id: "f3",
    title: "The Identity Shift Nobody Warns You About",
    excerpt:
      "You moved countries. But somewhere along the way, you also lost the version of yourself that felt sure.",
    category: "Identity",
    cover_image_url: null,
    slug: "#",
    external_url: null,
  },
] as BlogPost[];

const BlogPreview = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: dbPosts } = useQuery({
    queryKey: ["blog-posts-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, category, external_url")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data || []) as BlogPost[];
    },
  });

  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : fallbackPosts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="insights"
      className="py-24 md:py-32"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-16 md:mb-20"
          style={{ color: "#3DA776" }}
        >
          The thought behind Re-Rooted®
        </p>

        <h2
          className="text-center font-extrabold tracking-tight"
          style={{ color: "#1A1A1A", fontSize: "clamp(28px, 4vw, 36px)" }}
        >
          Insights from the journey
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-center text-sm md:text-base"
          style={{ color: "#6B6B6B" }}
        >
          Stories, perspectives, and lessons from the expat experience, written
          by Yasser Abbas.
        </p>

        <div
          ref={ref}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post, i) => {
            const href = post.external_url || (post.slug && post.slug !== "#" ? `/blog/${post.slug}` : "#");
            const isExternal = !!post.external_url;
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={
                  visible
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : undefined
                }
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col overflow-hidden rounded-xl bg-white transition-shadow duration-300 hover:shadow-lg"
                style={{ border: "1px solid #e8e4ed" }}
              >
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="flex aspect-video items-center justify-center text-xs font-medium overflow-hidden"
                  style={{ backgroundColor: "#e8e4ed", color: "#9a94a8" }}
                >
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span>Featured image</span>
                  )}
                </a>

                <div className="flex flex-1 flex-col p-5">
                  {post.category && (
                    <span
                      className="mb-3 w-fit rounded-full px-3 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(61,167,118,0.12)",
                        color: "#3DA776",
                      }}
                    >
                      {post.category}
                    </span>
                  )}

                  <h3
                    className="text-lg font-bold leading-snug"
                    style={{ color: "#1A1A1A" }}
                  >
                    {post.title}
                  </h3>

                  <p
                    className="mt-2 flex-1 text-sm leading-relaxed"
                    style={{ color: "#6B6B6B" }}
                  >
                    {post.excerpt}
                  </p>

                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-flex items-center text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#3DA776" }}
                  >
                    Read more →
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center">
          <a
            href="/blog"
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: "#3DA776" }}
          >
            See all insights →
          </a>
        </p>
      </div>
    </section>
  );
};

export default BlogPreview;
