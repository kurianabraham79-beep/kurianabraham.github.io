"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { PERSON, mailto } from "@/lib/content";
import { Arrow } from "./Icons";

/* The lineage graph behind the name: three sources merge, pass three stages and reach one KPI.
   Coordinates are in a 1440 x 900 box; the graph sits in the upper right, clear of the name. */
const SOURCES = [
  { id: "s1", label: "orders.csv", y: 168 },
  { id: "s2", label: "crm_api", y: 248 },
  { id: "s3", label: "erp.sales", y: 328 },
];
const STAGE_X = [1010, 1150, 1290];
const STAGE_L = ["transform", "validate", "serve"];
const MERGE = { x: 1010, y: 248 };
const srcPath = (y) => `M796 ${y} C 900 ${y}, 920 ${MERGE.y}, ${MERGE.x - 14} ${MERGE.y}`;

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray(".hero__name .row");
        const splits = rows.map((r) => SplitText.create(r, { type: "chars", aria: "auto" }));
        const chars = splits.flatMap((s) => s.chars);
        const lede = SplitText.create(".hero__lede", { type: "lines", mask: "lines", aria: "auto" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero__top > *", { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.08 })
          .from(chars, { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.028 }, 0.1)
          .from(".g-path", { drawSVG: "0%", duration: 1.6, stagger: 0.08, ease: "power2.inOut" }, 0.3)
          .from(".g-node", { scale: 0, transformOrigin: "50% 50%", duration: 0.7, stagger: 0.06, ease: "back.out(2)" }, 0.6)
          .from(".g-label", { autoAlpha: 0, x: -6, duration: 0.6, stagger: 0.05 }, 0.9)
          .from(lede.lines, { yPercent: 100, duration: 1.1, stagger: 0.08 }, 0.7)
          .from(".hero__role, .hero__cta > *", { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.9)
          .from(".hero__kpi", { autoAlpha: 0, y: 16, duration: 0.9 }, 1.1);

        // the KPI counts up once, from the dashboard's own figure
        const kpi = { v: 0 };
        tl.to(kpi, { v: 2.45, duration: 1.6, ease: "power2.out", onUpdate: () => {
          const el = root.current?.querySelector(".hero__kpi .v");
          if (el) el.textContent = `₹${kpi.v.toFixed(2)} Cr`;
        } }, 1.2);

        // pulses run along the lines after the intro, one cycle every 3.2 s
        gsap.fromTo(".g-pulse", { strokeDashoffset: 260 }, { strokeDashoffset: -60, duration: 3.2, ease: "none", repeat: 4, stagger: { each: 0.4 }, delay: 2 });

        // on scroll the two rows of the name drift apart, the graph lifts away
        gsap.to(".hero__name .row--1", { xPercent: -6, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero__name .row--2", { xPercent: 5, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero__graph", { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });

        return () => { splits.forEach((s) => s.revert()); lede.revert(); };
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" ref={root} aria-labelledby="hero-name">
      <div className="hero__graph" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMin slice">
          <defs>
            <linearGradient id="fade" x1="0" x2="1">
              <stop offset="0" stopColor="#ede8de" stopOpacity="0" />
              <stop offset="0.3" stopColor="#ede8de" stopOpacity="0.22" />
              <stop offset="1" stopColor="#ede8de" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          {SOURCES.map((s) => (
            <g key={s.id}>
              <path className="g-path" d={srcPath(s.y)} stroke="url(#fade)" strokeWidth="1.2" fill="none" />
              <path className="g-pulse" d={srcPath(s.y)} stroke="#c8f560" strokeWidth="1.6" fill="none" strokeDasharray="34 400" strokeLinecap="round" />
              <circle className="g-node" cx="796" cy={s.y} r="4" fill="#0b0d10" stroke="#ede8de" strokeOpacity="0.5" />
              <text className="g-label" x="780" y={s.y + 4} textAnchor="end" fill="#ede8de" fillOpacity="0.42" fontFamily="var(--mono)" fontSize="12">{s.label}</text>
            </g>
          ))}
          <path className="g-path" d={`M${MERGE.x} ${MERGE.y} H ${STAGE_X[2]} V 420`} stroke="#ede8de" strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
          <path className="g-pulse" d={`M${MERGE.x} ${MERGE.y} H ${STAGE_X[2]} V 420`} stroke="#c8f560" strokeWidth="1.6" fill="none" strokeDasharray="34 400" strokeLinecap="round" />
          {STAGE_X.map((x, i) => (
            <g key={x}>
              <rect className="g-node" x={x - 14} y={MERGE.y - 14} width="28" height="28" rx="7" fill="#111419" stroke={i === 1 ? "#c8f560" : "#ede8de"} strokeOpacity={i === 1 ? 0.9 : 0.4} />
              <text className="g-label" x={x} y={MERGE.y - 26} textAnchor="middle" fill="#ede8de" fillOpacity="0.42" fontFamily="var(--mono)" fontSize="12">{STAGE_L[i]}</text>
            </g>
          ))}
          <circle className="g-node" cx={STAGE_X[2]} cy="430" r="6" fill="#c8f560" />
        </svg>
      </div>

      <div className="wrap hero__top">
        <span className="eyebrow">{PERSON.status}</span>
        <a className="scroll-cue" href="#lineage"><i aria-hidden="true" />Scroll to trace a number</a>
      </div>

      <div className="wrap">
        <h1 id="hero-name" className="hero__name display">
          <span className="row row--1">Kurian</span>
          <span className="row row--2"><em>Abraham</em></span>
        </h1>
        <div className="hero__foot">
          <p className="hero__role">{PERSON.role}<br />Pipelines · Models · Power BI</p>
          <p className="hero__lede">
            I build the pipelines, models and dashboards behind a business decision, and I can <strong>trace every number back to the row it came from.</strong>
          </p>
          <div className="hero__kpi" role="group" aria-label="Total sales on the Product Sales and Revenue dashboard: 2.45 crore rupees, from 5,842 orders">
            <div className="v">₹2.45 Cr</div>
            <div className="k">Total sales · 5,842 orders</div>
          </div>
          <div className="hero__cta">
            <a className="btn btn--accent" href={mailto("role")}>Email Kurian <Arrow /></a>
            <a className="btn btn--ghost" href="#work">See the work</a>
          </div>
        </div>
      </div>
    </section>
  );
}
