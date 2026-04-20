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
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[320px_minmax(0,1fr)] md:gap-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-24 xl:gap-32">
          <div className="md:pt-[11rem] lg:pt-[14rem] xl:pt-[15rem]">
            <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs">
              Why ReRooted
            </p>

            <p className="max-w-[17ch] text-[clamp(1.125rem,1.4vw,1.5rem)] leading-[1.55] text-muted-foreground">
              Global mobility is usually treated as
              <br />
              logistics, visas, shipping, tax. But the
              <br />
              hardest parts of moving are invisible:
              <br />
              identity, belonging, family equilibrium,
              <br />
              confidence at work.
            </p>
          </div>

          <div className="md:justify-self-end md:max-w-[620px] lg:max-w-[820px] xl:max-w-[980px]">
            <h2 className="font-display text-[clamp(3.25rem,6.2vw,7.25rem)] font-medium leading-[0.96] tracking-[-0.055em] text-primary">
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
      </div>
    </section>
  );
}
