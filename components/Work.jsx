"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { PROJECTS } from "@/lib/content";
import { Arrow } from "./Icons";

const RETURN_KEY = "ka-return-y";

export function ConceptArt() {
  // the concept's own picture: its four stages, drawn as a pipeline
  const nodes = ["Ingest", "Transform", "Validate", "Serve"];
  return (
    <div className="concept-art" role="img" aria-label="Concept pipeline: files, APIs and source systems are ingested, transformed, validated and served to Power BI">
      <svg viewBox="0 0 900 400" aria-hidden="true">
        {["Files", "APIs", "Source systems"].map((s, i) => (
          <g key={s}>
            <rect x="40" y={92 + i * 80} width="150" height="44" rx="10" fill="none" stroke="#ede8de" strokeOpacity="0.35" strokeDasharray="4 4" />
            <text x="115" y={119 + i * 80} textAnchor="middle" fill="#ede8de" fillOpacity="0.7" fontFamily="var(--mono)" fontSize="15">{s}</text>
            <path d={`M190 ${114 + i * 80} C 240 ${114 + i * 80}, 230 194, 270 194`} fill="none" stroke="#ede8de" strokeOpacity="0.3" />
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={n}>
            <rect x={270 + i * 155} y="170" width="130" height="48" rx="12" fill={i === 3 ? "#c8f560" : "#171b21"} stroke={i === 2 ? "#c8f560" : "#ede8de"} strokeOpacity={i === 2 ? 1 : 0.35} />
            <text x={335 + i * 155} y="200" textAnchor="middle" fill={i === 3 ? "#0b0d10" : "#ede8de"} fontFamily="var(--mono)" fontSize="15">{n}</text>
            {i < 3 && <path d={`M${400 + i * 155} 194 H ${425 + i * 155}`} stroke="#ede8de" strokeOpacity="0.4" />}
          </g>
        ))}
        <text x="335" y="262" fill="#ede8de" fillOpacity="0.4" fontFamily="var(--mono)" fontSize="13">SQL · Python · PySpark → schema · rules → data models · Power BI</text>
      </svg>
    </div>
  );
}

export default function Work() {
  const root = useRef(null);

  // coming back from a case study: return to the same place in the gallery
  useEffect(() => {
    let y = null;
    try { y = sessionStorage.getItem(RETURN_KEY); } catch {}
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (y !== null && nav?.type === "back_forward") {
      // the page sets the position itself: the browser's own restore runs before the pins exist
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      const target = Number(y);
      const go = () => window.scrollTo({ top: target, behavior: "instant" });
      // a refresh (fonts, images, pins) can move the page under the visitor: put it back each time for 2 s
      const onRefresh = () => go();
      ScrollTrigger.addEventListener("refresh", onRefresh);
      setTimeout(() => ScrollTrigger.removeEventListener("refresh", onRefresh), 2000);
      const start = () => requestAnimationFrame(() => { ScrollTrigger.refresh(); go(); });
      if (document.fonts?.ready) document.fonts.ready.then(start); else start();
    }
    try { sessionStorage.removeItem(RETURN_KEY); } catch {}
  }, []);

  const remember = () => { try { sessionStorage.setItem(RETURN_KEY, String(window.scrollY)); } catch {} };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".work .section__head > *", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".work .section__head", start: "top 80%" } });
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector(".work__track");
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work__viewport",
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            pinType: "transform", // transforms never count as layout shift
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        // each screenshot drifts inside its frame as it crosses the screen
        gsap.utils.toArray(".wcard__frame img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: { trigger: img.closest(".wcard"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true } });
        });
        gsap.from(".wcard__meta", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1, scrollTrigger: { trigger: ".work__viewport", start: "top 70%" } });
      });
    },
    { scope: root }
  );

  return (
    <section className="section work" id="work" ref={root} aria-labelledby="work-h">
      <div className="wrap section__head">
        <div>
          <span className="eyebrow">Selected work</span>
          <h2 id="work-h" className="h2">Three dashboards, <em>one concept.</em></h2>
        </div>
        <p className="lead">Commercial, marketing and healthcare reporting in Power BI, and a data platform designed from ingest to serve. Dashboard previews are project work, not client endorsements.</p>
      </div>
      <div className="work__viewport">
        <div className="work__track">
          {PROJECTS.map((p) => (
            <a className="wcard" key={p.slug} href={`/work/${p.slug}/`} onClick={remember}>
              <div className="wcard__frame">
                {p.concept && <span className="wcard__badge">Concept</span>}
                {p.image ? (
                  <img
                    src={`/img/${p.image}-1200.webp`}
                    srcSet={`/img/${p.image}-700.webp 700w, /img/${p.image}-1200.webp 1200w, /img/${p.image}.webp 1693w`}
                    sizes="(max-width: 1023px) 92vw, 78vw"
                    width="1693"
                    height="929"
                    loading="lazy"
                    decoding="async"
                    alt={p.alt}
                  />
                ) : (
                  <ConceptArt />
                )}
              </div>
              <div className="wcard__meta">
                <span className="wcard__no">{p.no}</span>
                <h3 className="wcard__title">{p.title}</h3>
                <span className="wcard__go" aria-hidden="true"><Arrow dir="up-right" /></span>
                <p className="wcard__sub">{p.discipline} · {p.tool}{p.concept ? " · concept" : ""}</p>
                <div className="wcard__tags">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </a>
          ))}
          <div className="work__end">
            <span className="eyebrow">Next</span>
            <p className="h2" style={{ fontSize: "clamp(40px, 4.6vw, 72px)" }}>See how a number gets <em>audited.</em></p>
            <a className="btn btn--ghost" href="#audit">Try the audit <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
