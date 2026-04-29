import rootsIcon from "@/assets/roots-icon.png";

export default function WhyReRooted() {
  return (
    <>
      {/* Section 1: Statement with tree background */}
      <section
        id="why-rerooted"
        className="relative overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/why-rerooted-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Flat warm-white veil */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "rgba(250, 249, 246, 0.82)" }}
        />

        <div
          className="relative mx-auto flex w-full flex-col gap-12"
          style={{ maxWidth: 1800, padding: "160px 64px" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs">
            Why ReRooted
          </p>

          <h2
            className="font-display text-primary"
            style={{
              fontWeight: 500,
              fontSize: "clamp(2.5rem, 6.5vw, 8rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
              maxWidth: "100%",
            }}
          >
            A relocation is{" "}
            <em className="italic text-secondary">not a shipment.</em> It&apos;s
            a person being{" "}
            <span className="text-accent">replanted.</span> We tend to the{" "}
            <em className="italic text-secondary">roots,</em> so the move takes
            hold.
          </h2>

          <p
            className="text-foreground/90"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              lineHeight: 1.55,
              maxWidth: "56ch",
              margin: 0,
            }}
          >
            Global mobility is usually treated as logistics, visa, shipping,
            tax. But the hardest parts of moving are invisible: identity,
            belonging, family equilibrium, confidence at work.
          </p>
        </div>
      </section>

      {/* Section 2: Three pillars */}
      <section
        id="approach"
        className="relative overflow-hidden bg-background text-foreground"
      >
        <div className="mx-auto max-w-[1760px] px-6 pb-24 pt-20 sm:px-8 md:px-10 md:pb-28 md:pt-24 lg:px-14 lg:pb-32 lg:pt-36 xl:px-16 xl:pt-44">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10 lg:gap-16 xl:gap-24">
            {[
              {
                numeral: "i.",
                title: "Grounded in evidence",
                body: "ICF-credentialed coaching methods combined with Innosuisse-backed research on relocation outcomes. Every session has a purpose; every purpose has a measure.",
              },
              {
                numeral: "ii.",
                title: "Built for both sides",
                body: "Designed for the person relocating and for the HR team underwriting the move. Two parallel tracks, one shared language of progress.",
              },
              {
                numeral: "iii.",
                title: "Finite, focused, finished",
                body: "90 days. Six coaching sessions. Two assessments. One clear report. ReRooted is a program, not a subscription, with a defined end that marks a beginning.",
              },
            ].map((pillar) => (
              <div key={pillar.numeral} className="flex flex-col">
                <div className="flex items-center gap-4">
                  <img
                    src={rootsIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-auto shrink-0"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(54%) sepia(38%) saturate(519%) hue-rotate(106deg) brightness(92%) contrast(89%)",
                    }}
                  />
                  <span className="h-px flex-1 bg-primary/20" />
                </div>

                <div
                  aria-hidden="true"
                  className="mt-6 h-5 w-2 rounded-full bg-secondary"
                />

                <h3 className="mt-5 font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-primary">
                  {pillar.title}
                </h3>

                <p className="mt-5 max-w-[36ch] text-lg font-normal leading-[1.55] text-foreground/90">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
