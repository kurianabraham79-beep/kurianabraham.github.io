"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { STAGES } from "@/lib/content";

/* One record, order A-1043, as it looks at each stage. The same order is the duplicate in the audit below. */
function Pane({ id }) {
  if (id === "ingest")
    return (
      <pre className="code" aria-label="The raw record as it arrives" translate="no">
{"{\n"}
{"  "}<span className="k">"source"</span>:   <span className="s">"orders.csv"</span>,{"\n"}
{"  "}<span className="k">"order_id"</span>: <span className="s">"A-1043"</span>,{"\n"}
{"  "}<span className="k">"amount"</span>:   <span className="bad">"240.00 "</span>,{"\n"}
{"  "}<span className="k">"region"</span>:   <span className="bad">" west"</span>,{"\n"}
{"  "}<span className="k">"shipment"</span>: [<span className="s">"S-203"</span>, <span className="s">"S-204"</span>]{"\n"}
{"}"}
      </pre>
    );
  if (id === "transform")
    return (
      <pre className="code" aria-label="The record after transformation: two typed rows, one per shipment" translate="no">
<span className="k">order_id  shipment  amount   region</span>{"\n"}
<span className="s">A-1043    S-203     </span><span className="good">240.00</span><span className="s">   </span><span className="good">West</span>{"\n"}
<span className="s">A-1043    S-204     </span><span className="good">240.00</span><span className="s">   </span><span className="good">West</span>{"\n\n"}
<span className="k">-- typed: decimal(10,2), category</span>{"\n"}
<span className="k">-- joined to shipments: </span><span className="bad">2 rows, 1 order</span>
      </pre>
    );
  if (id === "validate")
    return (
      <ul className="checks" aria-label="Validation checks">
        <li><span className="ok">✓</span> Schema matches the model</li>
        <li><span className="ok">✓</span> amount is a number, never below zero</li>
        <li><span className="ok">✓</span> region is in the reference list</li>
        <li><span className="no">✗</span> One row per order_id: A-1043 appears twice</li>
        <li><span className="ok">✓</span> Resolved: order grain restored, one row kept</li>
      </ul>
    );
  return (
    <div className="kpi-tile" aria-label="The served figure with its trace">
      <div className="k">Revenue · five-order sample</div>
      <div className="v">₹505</div>
      <div className="trace">
        = 120 + 85 + <b>240</b> + 60<br />
        A-1043 counted once · traced to orders.csv
      </div>
    </div>
  );
}

export default function Lineage() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        root.current.classList.add("is-pinned");
        const panes = gsap.utils.toArray(".pane");
        const steps = gsap.utils.toArray(".lstep");
        gsap.set(panes, { autoAlpha: 0, y: 24 });
        gsap.set(panes[0], { autoAlpha: 1, y: 0 });
        steps.forEach((s, i) => s.setAttribute("data-active", String(i === 0)));

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: ".lineage__pin",
            start: "top top",
            end: () => "+=" + window.innerHeight * 3,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / 3, directional: false, inertia: false, duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut", delay: 0.08 },
            onUpdate: (self) => {
              const i = Math.min(3, Math.round(self.progress * 3));
              steps.forEach((s, j) => s.setAttribute("data-active", String(j === i)));
              const label = root.current?.querySelector(".record__bar b");
              if (label) label.textContent = STAGES[i].name.toLowerCase();
            },
          },
        });
        tl.to(".lineage__rail i", { scaleX: 1, ease: "none", duration: 3 }, 0);
        for (let i = 1; i < panes.length; i++) {
          // the swap happens between two stages, so each stage is whole when the scroll snaps to it
          tl.to(panes[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, i - 0.75)
            .to(panes[i], { autoAlpha: 1, y: 0, duration: 0.35 }, i - 0.45);
        }
        return () => root.current?.classList.remove("is-pinned");
      });

      // heading reveal everywhere motion is fine
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lineage .h2, .lineage .eyebrow", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      });
      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  return (
    <section className="lineage" id="lineage" ref={root} aria-labelledby="lineage-h">
      <div className="lineage__pin">
        <div className="wrap lineage__grid">
          <div>
            <span className="eyebrow">Method · one record, four stages</span>
            <h2 id="lineage-h" className="h2">Follow a number <em>home.</em></h2>
            <ol className="lineage__steps">
              {STAGES.map((s, i) => (
                <li className="lstep" key={s.id} data-active="true">
                  <span className="lstep__n">{s.n}</span>
                  <span className="lstep__name">{s.name}</span>
                  <span className="lstep__tools">{s.tools}</span>
                  <p className="lstep__line">{s.line}</p>
                  <div className="pane-inline" aria-hidden="true"><Pane id={s.id} /></div>
                </li>
              ))}
            </ol>
            <div className="lineage__rail" aria-hidden="true"><i /></div>
          </div>
          <div className="record" role="group" aria-label="Order A-1043 at each stage" translate="no">
            <div className="record__bar">
              <span className="record__dots" aria-hidden="true"><i /><i /><i /></span>
              <span>order A-1043 · <b>ingest</b></span>
            </div>
            <div className="record__stage">
              {STAGES.map((s) => (
                <div className="pane" key={s.id} data-stage={s.id}>
                  <Pane id={s.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
