/**
 * Why ReRooted — editorial two-column statement section.
 * Self-contained: no external CSS, no Tailwind, no design tokens.
 * Drop into Lovable and render after your hero.
 */

const COLORS = {
  blue: "#1F299C",
  green: "#3DA776",
  warmWhite: "#FAF9F6",
  mute: "#6B6B6B",
  ink: "#1A1A1A",
};

export default function WhyReRooted() {
  return (
    <section
      id="approach"
      style={{
        padding: "180px 0 160px",
        position: "relative",
        background: COLORS.warmWhite,
        color: COLORS.ink,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 980px) {
          .wrr-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .wrr-label { position: static !important; }
          .wrr-statement { font-size: 40px !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 48px",
        }}
      >
        <div
          className="wrr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 90,
            alignItems: "start",
          }}
        >
          {/* Left: eyebrow + small intro paragraph */}
          <div
            className="wrr-label"
            style={{ position: "sticky", top: 120 }}
          >
            <h4
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: COLORS.blue,
                margin: "0 0 18px 0",
                fontWeight: 600,
              }}
            >
              Why ReRooted
            </h4>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: COLORS.mute,
                maxWidth: "32ch",
                margin: 0,
              }}
            >
              Global mobility is usually treated as logistics: visas,
              shipping, tax. But the hardest parts of moving are invisible:
              identity, belonging, family equilibrium, confidence at work.
            </p>
          </div>

          {/* Right: big editorial statement */}
          <div
            className="wrr-statement"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(40px, 4.8vw, 76px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: COLORS.blue,
              fontWeight: 400,
            }}
          >
            A relocation is{" "}
            <em style={{ fontStyle: "italic", color: COLORS.green }}>
              not a shipment.
            </em>
            <br />
            It's a person being{" "}
            <span style={{ color: "rgba(31,41,156,0.35)" }}>replanted.</span>
            <br />
            We tend to the{" "}
            <em style={{ fontStyle: "italic", color: COLORS.green }}>
              roots,
            </em>{" "}
            so the move takes hold.
          </div>
        </div>
      </div>
    </section>
  );
}
