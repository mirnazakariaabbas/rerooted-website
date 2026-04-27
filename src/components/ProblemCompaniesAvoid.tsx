/**
 * Field Note 02 — The Problem
 * Editorial, black-background section. Intentionally diverges from the
 * project's Manrope/Deep-Blue tokens; styling is scoped to this component
 * via a local <style> block so no global tokens are affected.
 */
const ProblemCompaniesAvoid = () => {
  return (
    <section className="pca-root" aria-labelledby="pca-headline">
      <style>{`
        .pca-root {
          background: #0A0A0A;
          color: #FFFFFF;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter Tight', sans-serif;
        }

        /* ---- Edge rails ---- */
        .pca-rail {
          position: fixed;
          top: 0;
          width: 56px;
          height: 100vh;
          pointer-events: none;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0;
        }
        .pca-rail--left  { left: 0; }
        .pca-rail--right { right: 0; }
        .pca-rail__top {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
        }
        .pca-rail__bottom {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
        }
        @media (max-width: 980px) {
          .pca-rail { display: none; }
        }

        /* ---- Inner frame ---- */
        .pca-frame {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 80px 100px;
        }
        @media (max-width: 980px) {
          .pca-frame { padding: 80px 28px 100px; }
        }

        /* ---- Top meta strip ---- */
        .pca-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
        }

        /* ---- Masthead ---- */
        .pca-masthead {
          margin-top: 60px;
          display: inline-flex;
          align-items: flex-start;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(64px, 14vw, 220px);
          line-height: 0.88;
          letter-spacing: -0.045em;
          color: #FFFFFF;
        }
        .pca-percent {
          font-family: 'Inter Tight', sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 0.22em;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3DA776;
          margin-left: 0.5em;
          margin-top: 0.6em;
          line-height: 1;
        }
        @media (max-width: 980px) {
          .pca-masthead { font-size: 56px; }
          .pca-percent  { font-size: 28px; margin-top: 0.4em; }
        }

        /* ---- Subhead ---- */
        .pca-subhead {
          margin-top: 28px;
          max-width: 44ch;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(20px, 1.6vw, 26px);
          line-height: 1.35;
          color: #FFFFFF;
        }

        /* ---- Findings divider ---- */
        .pca-findings {
          margin-top: 110px;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.14);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
        }

        /* ---- Stats grid ---- */
        .pca-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .pca-grid { grid-template-columns: 1fr; gap: 56px; }
        }
        .pca-col {
          display: flex;
          flex-direction: column;
          gap: 22px;
          border-top: 1px solid rgba(255,255,255,0.18);
          padding-top: 24px;
        }
        .pca-tag {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3DA776;
        }
        .pca-num {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: clamp(56px, 5.5vw, 88px);
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: #FFFFFF;
        }
        @media (max-width: 980px) {
          .pca-num { font-size: 64px; }
        }
        .pca-cap {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 17px;
          line-height: 1.45;
          color: rgba(255,255,255,0.55);
          max-width: 30ch;
        }

        /* ---- Closing line ---- */
        .pca-closing {
          margin-top: 130px;
          padding-top: 36px;
          border-top: 1px solid rgba(255,255,255,0.14);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: end;
        }
        @media (max-width: 980px) {
          .pca-closing { grid-template-columns: 1fr; }
        }
        .pca-closing__lead {
          font-family: 'Instrument Serif', serif;
          font-style: normal;
          font-weight: 400;
          font-size: clamp(22px, 2vw, 32px);
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: #FFFFFF;
          max-width: 40ch;
        }
        .pca-closing__accent {
          font-style: italic;
          color: #3DA776;
        }
        .pca-closing__meta {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-align: right;
        }
      `}</style>

      {/* Edge rails */}
      <div className="pca-rail pca-rail--left" aria-hidden="true">
        <span className="pca-rail__top">Re-Rooted® · Field Note 02</span>
        <span className="pca-rail__bottom">2026</span>
      </div>
      <div className="pca-rail pca-rail--right" aria-hidden="true">
        <span className="pca-rail__top">The human side of global mobility</span>
        <span className="pca-rail__bottom">02</span>
      </div>

      <div className="pca-frame">
        {/* Top meta strip */}
        <div className="pca-meta">
          <span>§ 02 , The Problem</span>
          <span>Sources · Aetna Intl. 2023 / EY Mobility 2024</span>
        </div>

        {/* Masthead */}
        <h2 id="pca-headline" className="pca-masthead">
          Ninety-eight
          <span className="pca-percent">percent</span>
        </h2>

        {/* Subhead */}
        <p className="pca-subhead">
          of expats report burnout symptoms during international assignments.
          The other figures land just as squarely.
        </p>

        {/* Findings divider */}
        <div className="pca-findings">
          <span>The findings</span>
          <span>iii. data points</span>
        </div>

        {/* Stats grid */}
        <div className="pca-grid">
          <div className="pca-col">
            <span className="pca-tag">01 , Performance</span>
            <span className="pca-num">1 in 3</span>
            <span className="pca-cap">
              don&apos;t meet performance expectations abroad.
            </span>
          </div>
          <div className="pca-col">
            <span className="pca-tag">02 , Retention</span>
            <span className="pca-num">42%</span>
            <span className="pca-cap">
              have considered leaving their employer due to relocation stress.
            </span>
          </div>
          <div className="pca-col">
            <span className="pca-tag">03 , Recovery</span>
            <span className="pca-num">80%</span>
            <span className="pca-cap">
              take over a year to recover productivity, or never fully do.
            </span>
          </div>
        </div>

        {/* Closing line */}
        <div className="pca-closing">
          <p className="pca-closing__lead">
            These aren&apos;t edge cases. They&apos;re the{" "}
            <span className="pca-closing__accent">default outcome</span> of
            treating a human move as a shipping problem.
          </p>
          <span className="pca-closing__meta">
            Re-Rooted® exists to change that
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProblemCompaniesAvoid;
