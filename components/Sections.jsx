"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { CAPABILITIES, PROCESS, PERSON, SUBJECTS, TOOLS_MARQUEE, mailto } from "@/lib/content";
import { Arrow } from "./Icons";

/* ------------------------------------------------------------------ marquee */
export function Marquee() {
  const root = useRef(null);
  const tweenRef = useRef(null);
  const [paused, setPaused] = useState(false);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = root.current.querySelector(".marquee__track");
        const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
        tweenRef.current = tween;
        // scrolling speeds it up for a moment, then it settles back
        gsap.to({}, { scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
          gsap.to(tween, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true, onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1.2 }) });
        } } });
        const pause = () => tween.pause();
        const play = () => { if (!root.current?.dataset.paused) tween.play(); };
        root.current.addEventListener("pointerenter", pause);
        root.current.addEventListener("pointerleave", play);
        return () => { root.current?.removeEventListener("pointerenter", pause); root.current?.removeEventListener("pointerleave", play); };
      });
    },
    { scope: root }
  );
  const items = [...TOOLS_MARQUEE, ...TOOLS_MARQUEE];
  return (
    <div className="marquee" ref={root} data-paused={paused ? "true" : undefined}>
      <p className="sr">Tools and practices: {TOOLS_MARQUEE.join(", ")}</p>
      <button type="button" className="marquee__pause" aria-label={paused ? "Play the moving list of tools" : "Pause the moving list of tools"} aria-pressed={paused}
        onClick={() => { const t = tweenRef.current; if (!t) return; if (paused) { t.play(); setPaused(false); } else { t.pause(); setPaused(true); } }}>
        {paused
          ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>}
      </button>
      <div className="marquee__track" aria-hidden="true">
        {items.map((t, i) => <span className="marquee__item" key={i}>{t}</span>)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ capabilities */
export function Capabilities() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".capabilities .section__head > *", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
        gsap.utils.toArray(".cap").forEach((row) => {
          gsap.from(row.children, { y: 36, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 85%" } });
        });
      });
    },
    { scope: root }
  );
  return (
    <section className="section capabilities" id="capabilities" ref={root} aria-labelledby="cap-h">
      <div className="wrap section__head">
        <div>
          <span className="eyebrow">Capabilities</span>
          <h2 id="cap-h" className="h2">From messy data to <em>decisions.</em></h2>
        </div>
        <p className="lead">Practical data work that connects the technical details to the business questions behind them.</p>
      </div>
      <div className="wrap caps">
        {CAPABILITIES.map((c) => (
          <div className="cap" key={c.n}>
            <span className="cap__n">{c.n}</span>
            <h3 className="cap__title">{c.title}</h3>
            <p className="cap__body">{c.body}</p>
            <ul className="cap__tools" style={{ listStyle: "none", padding: 0 }}>
              {c.tools.map((t) => (
                <li className="tool" key={t.name}>
                  {t.icon && <img src={t.icon} alt="" width={t.wide ? 34 : 20} height="20" className={t.wide ? "wide" : undefined} data-dark={t.name === "AWS" || t.name === "PySpark" ? "" : undefined} loading="lazy" />}
                  {t.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ process: stacking cards */
export function Process() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".process .section__head > *", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
        const cards = gsap.utils.toArray(".pcard");
        // each card settles back and dims a little as the next one slides over it
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, { scale: 0.94 - (cards.length - i) * 0.005, filter: "brightness(0.6)", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 55%", end: "top top+=160", scrub: true } });
        });
        cards.forEach((card) => {
          gsap.from(card.querySelector(".pcard__n"), { yPercent: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 80%" } });
        });
      });
    },
    { scope: root }
  );
  return (
    <section className="section process" id="process" ref={root} aria-labelledby="process-h">
      <div className="wrap section__head">
        <div>
          <span className="eyebrow">How I work</span>
          <h2 id="process-h" className="h2">Clear steps. <em>No black boxes.</em></h2>
        </div>
        <p className="lead">Every project starts with the business problem and ends with something your team can use and maintain.</p>
      </div>
      <ol className="wrap process__stack" style={{ listStyle: "none", padding: 0 }}>
        {PROCESS.map((p) => (
          <li className="pcard" key={p.n}>
            <span className="pcard__n" aria-hidden="true">{p.n}</span>
            <div>
              <span className="pcard__verb">Step {p.n} · {p.verb}</span>
              <h3 className="pcard__title">{p.title}</h3>
              <p className="pcard__body">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ contact */
export function Contact() {
  const root = useRef(null);
  const magnet = useRef(null);
  const [topic, setTopic] = useState("role");
  const [copied, setCopied] = useState("");

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".contact__big", { type: "lines,words", mask: "lines", aria: "auto" });
        gsap.from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: ".contact__big", start: "top 80%" } });
        gsap.from(".contact__grid > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, scrollTrigger: { trigger: ".contact__grid", start: "top 85%" } });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  // the big send button leans toward the pointer (fine pointers only)
  const onMove = contextSafe((e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const r = magnet.current.getBoundingClientRect();
    gsap.to(magnet.current, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.6, ease: "power3.out" });
  });
  const onLeave = contextSafe(() => gsap.to(magnet.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }));

  const copy = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(PERSON.email); ok = true; } catch {
      const ta = document.createElement("textarea");
      ta.value = PERSON.email; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch {}
      ta.remove();
    }
    setCopied(ok ? "Copied" : "Select and copy it");
    setTimeout(() => setCopied(""), 2400);
  };

  return (
    <section className="section contact" id="contact" ref={root} aria-labelledby="contact-h">
      <div className="wrap">
        <span className="eyebrow">Contact</span>
        <h2 id="contact-h" className="contact__big display">Have a data problem <em>worth solving?</em></h2>
        <div className="contact__grid">
          <div>
            <p className="lead" style={{ marginTop: 0 }}>Tell me what you’re trying to understand, automate or improve. I start with the problem and work back to the data.</p>
            <div style={{ marginTop: 32 }}>
              <div className="seg" role="radiogroup" aria-label="What the email is about">
                {Object.keys(SUBJECTS).map((k) => (
                  <label key={k}>
                    <input type="radio" name="topic" value={k} checked={topic === k} onChange={() => setTopic(k)} />
                    {SUBJECTS[k]}
                  </label>
                ))}
              </div>
            </div>
            <div className="mail">
              <a className="mail__addr" href={mailto(topic)}>{PERSON.email}</a>
              <button type="button" className="btn btn--ghost" onClick={copy}>{copied || "Copy address"}</button>
            </div>
            <p className="subject" aria-live="polite">Subject: {SUBJECTS[topic]}</p>
            <span className="sr" aria-live="polite">{copied ? `Email address ${copied.toLowerCase()}` : ""}</span>
          </div>
          <div className="contact__send" onPointerMove={onMove} onPointerLeave={onLeave}>
            <span className="status-dot"><i aria-hidden="true" />{PERSON.status}</span>
            <a ref={magnet} className="btn btn--accent magnet" href={mailto(topic)}>
              <span>Email Kurian</span>
              <Arrow dir="up-right" />
            </a>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="wrap footer__in">
          <span>© 2026 {PERSON.name} · Data engineering &amp; analytics</span>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>
    </section>
  );
}
