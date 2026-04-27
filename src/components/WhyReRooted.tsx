export default function WhyReRooted() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden bg-background text-foreground"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-[-16rem] hidden h-[34rem] md:block">
        <div className="absolute left-[10%] top-0 h-[34rem] w-[16rem] rotate-[18deg] rounded-[50%] border border-primary/5" />
        <div className="absolute right-[8%] top-[-2rem] h-[38rem] w-[16rem] rotate-[-9deg] rounded-[50%] border border-primary/5" />
      </div>

      <div className="mx-auto max-w-[1760px] px-6 pb-24 pt-20 sm:px-8 md:px-10 md:pb-28 md:pt-24 lg:px-14 lg:pb-32 lg:pt-36 xl:px-16 xl:pt-44">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[320px_minmax(0,1fr)] md:items-end md:gap-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-24 xl:gap-32">
          <div className="md:pb-[0.3em]">
            <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs">
              Why ReRooted
            </p>

            <p className="max-w-[28ch] text-lg font-normal leading-[1.55] text-muted-foreground">
              Global mobility is usually treated as logistics, visa, shipping, tax.
              <br />
              But the hardest parts of moving are invisible: identity, belonging,
              <br />
              family equilibrium, confidence at work.
            </p>
          </div>

          <div className="md:justify-self-end md:max-w-[620px] lg:max-w-[820px] xl:max-w-[980px]">
            <h2 className="font-display text-[clamp(1.625rem,3.1vw,3.625rem)] font-medium leading-[0.96] tracking-[-0.055em] text-primary">
              A relocation is <em className="italic text-secondary">not a</em>
              <br />
              <em className="italic text-secondary">shipment.</em>
              <br />
              It&apos;s a person being
              <br />
              <span className="text-accent">replanted.</span>
              <br />
              We tend to the <em className="italic text-secondary">roots</em>, so the
              <br />
              move takes hold.
            </h2>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-14 md:mt-32 md:grid-cols-3 md:gap-10 lg:mt-40 lg:gap-16 xl:gap-24">
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
                <span className="font-display text-lg italic text-primary">
                  {pillar.numeral}
                </span>
                <span className="h-px flex-1 bg-primary/20" />
              </div>

              <div
                aria-hidden="true"
                className="mt-6 h-5 w-2 rounded-full bg-secondary"
              />

              <h3 className="mt-5 font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-primary">
                {pillar.title}
              </h3>

              <p className="mt-5 max-w-[36ch] text-[clamp(0.875rem,1vw,1rem)] leading-[1.6] text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
