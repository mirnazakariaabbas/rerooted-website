import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-portrait.webp";
import blueArrow from "@/assets/blue-arrow.png";

import s from "./Services.module.css";

const cn = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");



const Services = () => {
  const rootRef = useRef<HTMLElement>(null);


  // Reveal-on-scroll observer (mirrors original inline script)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(`.${s.reveal}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(s.in);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);


  return (
    <main ref={rootRef} className={s.root}>
      <StickyNav />

      {/* HERO */}
      <section className={s.phero}>
        <div className={s.pheroGlow}></div>
        <div className={s.pheroInner}>
          <h1 className={cn(s.pheroTitle, "text-left")}>
            The Re-Rooted
            <sup style={{ fontSize: "0.35em", verticalAlign: "super", opacity: 0.7, fontStyle: "normal" }}>®</sup>{" "}
            Integration PROGRAM
          </h1>
        </div>
      </section>


      {/* INTRO STRIP */}
      <section className={s.introStrip}>
        <div className={cn(s.container, s.introStripGrid)}>
          <h2 className={s.reveal}>Relocation support shouldn't end at logistics.</h2>
          <div className={s.reveal}>
            <p>Re-Rooted® combines diagnostic tools, personalized coaching, and measurable outcomes. The goal is to help expatriates integrate, and help organizations see the difference.</p>
            <p>Every engagement is tailored to the move, the person, and the stage they're in.</p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className={s.steps} id="program">
        <div className={s.container}>
          <div className={cn(s.stepsHead, s.reveal)}>
            <h2>How the program works</h2>
          </div>

          {/* STEP 01 */}
          <div className={cn(s.step, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum} style={{ position: "relative", display: "inline-block" }}>
                  1.
                  <img
                    src={blueArrow}
                    alt=""
                    style={{
                      position: "absolute",
                      top: "1.1em",
                      left: "1.6em",
                      width: "3.2em",
                      height: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                      zIndex: 20,
                    }}
                    draggable={false}
                  />
                </div>
                <div className={s.stepWhen}>Day 0</div>
              </div>
              <h3>Discovery Call</h3>
              <p className="lead">A first conversation to understand the assignment, the person, and the family situation.</p>
              <ul>
                <li>HR, Hiring Manager or Global Mobility lead reaches out</li>
                <li>We map the move and the people involved</li>
                <li>Initial definition of the support model required to make the move successful</li>
              </ul>
            </div>
            <div className={s.stepMedia}>
              <div className={s.mediaCard}>
                <div className={s.animPhone}>
                  <div className={s.ring}></div>
                  <div className={s.ring}></div>
                  <div className={s.ring}></div>
                  <div className={s.phoneIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7a2 2 0 011.72 2z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* STEP 02 */}
          <div className={cn(s.step, s.flip, s.isGreen, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum}>2.</div>
                <div className={s.stepWhen}>Day 1</div>
              </div>
              <h3>Complexity Assessment</h3>
              <p className="lead">A structured assessment and scoring across eight dimensions, defining the level of risk to the assignment by understanding the strain the employee is going to face.</p>
              <ul>
                <li>1 & 2:  Assignment change context, new workplace environment </li>
                <li>3 & 4: Cultural Distance and Language</li>
                <li>5 & 6 : Spouse and Family situation</li>
                <li>7 & 8 : Geographical factors, Resilience & Adaptability</li>
              </ul>
            </div>
            <div className={cn(s.stepMedia, s.left)}>
              <div className={cn(s.mediaCard, s.blue)}>
                <div className={s.animDial}>
                  <svg className={s.dialSvg} viewBox="0 0 200 200">
                    <g transform="translate(100,100)">
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(-135)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(-90)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(-45)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(0)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(45)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(90)" />
                      <line className={s.dialTick} x1="0" y1="-86" x2="0" y2="-78" transform="rotate(135)" />
                    </g>
                    <circle className={s.dialBg} cx="100" cy="100" r="65" />
                    <circle className={s.dialFg} cx="100" cy="100" r="65" transform="rotate(-90 100 100)" />
                    <text className={s.dialNum} x="100" y="112">7.2</text>
                    <text className={s.dialLabel} x="100" y="128">Complexity</text>
                    <text className={s.dialLabel} x="100" y="146">Score</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 03 */}
          <div className={cn(s.step, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum}>3.</div>
                <div className={s.stepWhen}>Week 1</div>
              </div>
              <h3>Personal Needs Plan</h3>
              <p className="lead">A confidential deep dive with the relocating professional. We surface hidden blockers and define the success measures for the next 12 weeks.</p>
              <ul>
                <li>1:1 confidential intake</li>
                <li>Blockers and opportunities mapped</li>
                <li>12 week goal contract</li>
              </ul>
            </div>
            <div className={s.stepMedia}>
              <div className={cn(s.mediaCard, s.warm)}>
                <div className={s.animList}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={s.listItem}>
                      <div className={s.checkCircle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"></path></svg>
                      </div>
                      <div className={cn(s.lineFill, i === 1 || i === 3 ? s.med : i === 2 ? s.short : "")}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 04 */}
          <div className={cn(s.step, s.flip, s.isGreen, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum}>4.</div>
                <div className={s.stepWhen}>Weeks 2 to 14</div>
              </div>
              <h3>Active Coaching</h3>
              <p className="lead">Six 1:1 sessions across three months. Real time work on the things that actually determine whether a move takes root.</p>
              <ul>
                <li>Identity, relationships, performance, belonging</li>
                <li>Six structured sessions with flexible scheduling</li>
                <li>Tools and frameworks delivered between sessions</li>
              </ul>
            </div>
            <div className={cn(s.stepMedia, s.left)}>
              <div className={cn(s.mediaCard, s.green)}>
                <div className={s.animTree}>
                  <div className={s.treeStage}>
                    <img className={cn(s.treeImg, s.treeCanopyImg)} src={heroImage} alt="" />
                    <img className={cn(s.treeImg, s.treeRootsImg)} src={heroImage} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 05 */}
          <div className={cn(s.step, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum}>5.</div>
                <div className={s.stepWhen}>Week 15</div>
              </div>
              <h3>Final Assessment</h3>
              <p className="lead">A closing read against the Week 1 baseline. What shifted, what held, what's next, delivered as a written report.</p>
              <ul>
                <li>Re-run the 8 dimension diagnostic</li>
                <li>Written report, yours to keep</li>
                <li>Shareable summary for HR and sponsor</li>
              </ul>
            </div>
            <div className={s.stepMedia}>
              <div className={cn(s.mediaCard, s.blue)}>
                <div className={s.animChart}>
                  <svg className={s.chartSvg} viewBox="0 0 400 240" preserveAspectRatio="none">
                    <path className={s.chartArea} d="M 20,180 L 80,160 L 140,140 L 200,110 L 260,90 L 320,55 L 380,30 L 380,220 L 20,220 Z" />
                    <path className={s.chartLine} d="M 20,180 L 80,160 L 140,140 L 200,110 L 260,90 L 320,55 L 380,30" />
                    <circle className={s.chartDot} cx="20" cy="180" r="5" style={{ animationDelay: "0s" }} />
                    <circle className={s.chartDot} cx="80" cy="160" r="5" style={{ animationDelay: "0.1s" }} />
                    <circle className={s.chartDot} cx="140" cy="140" r="5" style={{ animationDelay: "0.2s" }} />
                    <circle className={s.chartDot} cx="200" cy="110" r="5" style={{ animationDelay: "0.3s" }} />
                    <circle className={s.chartDot} cx="260" cy="90" r="5" style={{ animationDelay: "0.4s" }} />
                    <circle className={s.chartDot} cx="320" cy="55" r="5" style={{ animationDelay: "0.5s" }} />
                    <circle className={s.chartDot} cx="380" cy="30" r="6" style={{ animationDelay: "0.6s" }} />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 06 */}
          <div className={cn(s.step, s.flip, s.isGreen, s.reveal)}>
            <div className={s.stepContent}>
              <div className={s.stepNumRow}>
                <div className={s.stepNum}>6.</div>
                <div className={s.stepWhen}>Post Program</div>
              </div>
              <h3>Ongoing Support</h3>
              <p className="lead">Quarterly check ins for the first year. The roots take longer than 90 days to deepen, and we stay with them.</p>
              <ul>
                <li>4 quarterly check ins in year one</li>
                <li>Direct line to your coach</li>
                <li>Optional family or partner sessions</li>
              </ul>
            </div>
            <div className={cn(s.stepMedia, s.left)}>
              <div className={s.mediaCard}>
                <div className={s.animOrbit}>
                  <div className={cn(s.orbitRing, s.r2)}>
                    <div className={s.orbitDot} style={{ top: "-18px", left: "50%", transform: "translateX(-50%)" }}>Q3</div>
                    <div className={s.orbitDot} style={{ bottom: "-18px", left: "50%", transform: "translateX(-50%)" }}>Q1</div>
                  </div>
                  <div className={cn(s.orbitRing, s.r1)}>
                    <div className={s.orbitDot} style={{ top: "50%", left: "-18px", transform: "translateY(-50%)" }}>Q4</div>
                    <div className={s.orbitDot} style={{ top: "50%", right: "-18px", transform: "translateY(-50%)" }}>Q2</div>
                  </div>
                  <div className={s.orbitCore}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 11c0 5.65-7 10-7 10z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <div className={s.ctaGlow}></div>
        <svg className={s.pheroArcs} viewBox="0 0 1440 700" preserveAspectRatio="none">
          <path d="M -100,400 Q 720,0 1540,400" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
          <path d="M -100,500 Q 720,100 1540,500" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        </svg>
        <div className={s.ctaInner}>
          <h2>Ready to start?</h2>
          <p>Book a discovery call. We'll map the move, the person, and the right next step together.</p>
          <div className={s.ctaButtons}>
            <Link to="/#contact" className={cn(s.btn, s.btnGreen)}>
              Book a discovery call{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"></path></svg>
            </Link>
            <Link to="/#contact" className={cn(s.btn, s.btnGhost)}>For employers</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
