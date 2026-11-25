"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { Arrow } from "./Icons";

export default function CaseHero({ project: p, children }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".case__title", { type: "lines,words", mask: "lines", aria: "auto" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".back, .case__eyebrow", { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.06 })
          .from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.05 }, 0.1)
          .from(".case__meta > div, .case__concept", { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 0.5)
          .fromTo(".case__shot", { clipPath: "inset(12% 8% 0% 8% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.6, ease: "power4.inOut" }, 0.4)
          .from(".case__shot img, .case__shot .concept-art", { scale: 1.15, duration: 1.8, ease: "power3.out" }, 0.4);
        gsap.utils.toArray(".case__body > *, .case__list li").forEach((el) => {
          gsap.from(el, { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  // Back to the gallery: when the visitor came from the home page, go back in history so the
  // browser and the gallery restore the same place; otherwise open the work section.
  const back = (e) => {
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === location.origin && ref.pathname === "/" && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    } catch {}
  };

  return (
    <div ref={root}>
      <div className="wrap">
        <a className="back" href="/#work" onClick={back}><Arrow dir="left" /> Back to the work</a>
        <p className="eyebrow case__eyebrow" style={{ marginTop: 32 }}>Case study {p.no}{p.concept ? " · concept" : ""}</p>
        <h1 className="case__title display">{p.title}</h1>
        <dl className="case__meta">
          <div><dt>Discipline</dt><dd>{p.discipline}</dd></div>
          <div><dt>Tool</dt><dd>{p.tool}</dd></div>
          <div><dt>Focus</dt><dd>{p.tags.join(", ")}</dd></div>
          <div><dt>Status</dt><dd>{p.concept ? "Concept design" : "Project work"}</dd></div>
        </dl>
        {p.concept && (
          <p className="case__concept"><span className="wcard__badge" style={{ position: "static" }}>Concept</span> A case study design for organising and checking data, not a system running in production.</p>
        )}
        {children}
      </div>
    </div>
  );
}
