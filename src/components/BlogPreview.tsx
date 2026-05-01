import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const posts = [
  {
    tag: "Values",
    title: "The Re-Rooted® Compass: 5 Questions to Ask Before You Move Abroad",
    excerpt:
      "Before the visa and the packing list, there are questions that will shape your entire experience — and most people never ask them.",
  },
  {
    tag: "Purpose",
    title: "What Nobody Tells You About the First 90 Days",
    excerpt:
      "The honeymoon ends. The loneliness begins. Here's what actually happens in the first three months — and how to navigate it.",
  },
  {
    tag: "Identity",
    title: "The Identity Shift Nobody Warns You About",
    excerpt:
      "You moved countries. But somewhere along the way, you also lost the version of yourself that felt sure. That's normal.",
  },
];

const BlogPreview = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        {/* Top-left section eyebrow header */}
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
          {posts.map((post, i) => (
            <motion.article
              key={i}
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
              {/* Placeholder image */}
              <div
                className="flex aspect-video items-center justify-center text-xs font-medium"
                style={{ backgroundColor: "#e8e4ed", color: "#9a94a8" }}
              >
                Featured image
              </div>

              <div className="flex flex-1 flex-col p-5">
                {/* Tag pill */}
                <span
                  className="mb-3 w-fit rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(61,167,118,0.12)",
                    color: "#3DA776",
                  }}
                >
                  {post.tag}
                </span>

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
                  href="#"
                  className="mt-4 inline-flex items-center text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#3DA776" }}
                >
                  Read more →
                </a>
              </div>
            </motion.article>
          ))}
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
