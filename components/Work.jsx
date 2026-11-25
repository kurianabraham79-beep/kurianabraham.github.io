"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { PROJECTS } from "@/lib/content";
import { Arrow } from "./Icons";
import ProjectArt from "./ProjectArt";

const RETURN_KEY = "ka-return-y";

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
        // each drawing drifts a little inside its frame as it crosses the screen
        gsap.utils.toArray(".wcard__frame svg").forEach((svg) => {
          gsap.fromTo(svg, { xPercent: -3 }, { xPercent: 3, ease: "none", scrollTrigger: { trigger: svg.closest(".wcard"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true } });
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
        <p className="lead">Commercial, marketing and healthcare reporting in Power BI, and a data platform designed from ingest to serve. The drawings show each dashboard’s own figures; they are project work, not client endorsements.</p>
      </div>
      <div className="work__viewport">
        <div className="work__track">
          {PROJECTS.map((p) => (
            <a className="wcard" key={p.slug} href={`/work/${p.slug}/`} onClick={remember}>
              <div className="wcard__frame">
                {p.concept && <span className="wcard__badge">Concept</span>}
                <ProjectArt project={p} />
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
