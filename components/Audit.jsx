"use client";
import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { AUDIT_ROWS } from "@/lib/content";
import { Arrow } from "./Icons";

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

function sums(rows) {
  const seen = new Set();
  let naive = 0, dedup = 0;
  for (const r of rows) {
    naive += r.total;
    if (!seen.has(r.order)) { seen.add(r.order); dedup += r.total; }
  }
  return { naive, dedup };
}

export default function Audit() {
  const root = useRef(null);
  const [picked, setPicked] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [status, setStatus] = useState("");

  // the totals are summed from the rows on the page, never typed in
  const { naive, dedup } = useMemo(() => sums(AUDIT_ROWS), []);
  const dupId = useMemo(() => {
    const seen = new Set();
    return AUDIT_ROWS.find((r) => (seen.has(r.order) ? true : (seen.add(r.order), false)))?.order;
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".audit .section__head > *, .audit__intro > *", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
        gsap.from(".console tbody tr", { autoAlpha: 0, x: 24, duration: 0.8, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".console", start: "top 75%" } });
      });
    },
    { scope: root }
  );

  const flash = contextSafe((selector) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(selector, { backgroundColor: "rgba(200,245,96,0.22)" }, { backgroundColor: "rgba(200,245,96,0)", duration: 1.2, ease: "power2.out" });
  });

  const countTo = contextSafe((to) => {
    const el = root.current?.querySelector("#audit-fixed");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(to); return; }
    const o = { v: naive };
    gsap.to(o, { v: to, duration: 1.2, ease: "power3.out", onUpdate: () => { el.textContent = fmt(Math.round(o.v)); } });
  });

  const toggle = (n) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n].slice(-2)));

  const reveal = () => {
    const rows = AUDIT_ROWS.map((r, i) => (r.order === dupId ? i + 1 : 0)).filter(Boolean);
    setPicked(rows);
    setRevealed(true);
    setStatus(`Order ${dupId} is in rows ${rows.join(" and ")}.`);
    requestAnimationFrame(() => flash(".console tr[data-dup='true'] td"));
  };
  const fix = () => {
    setFixed(true);
    setStatus(`Duplicate removed: revenue goes from ${fmt(naive)} to ${fmt(dedup)}.`);
    requestAnimationFrame(() => countTo(dedup));
  };
  const reset = () => { setPicked([]); setRevealed(false); setFixed(false); setStatus("Audit reset."); };

  let compare = "Pick two rows to compare them.";
  if (picked.length === 1) compare = `Row ${picked[0]} picked. Pick one more.`;
  if (picked.length === 2) {
    const [a, b] = picked.map((n) => AUDIT_ROWS[n - 1]);
    compare = a.order === b.order
      ? `Same order_id ${a.order}, two shipment_ids. The join made one row per shipment, so ${fmt(a.total)} is counted twice.`
      : `Different orders (${a.order} and ${b.order}), so nothing is counted twice here.`;
  }

  const seen = new Set();
  return (
    <section className="section audit" id="audit" ref={root} aria-labelledby="audit-h">
      <div className="wrap section__head">
        <div>
          <span className="eyebrow">Audit · try it</span>
          <h2 id="audit-h" className="h2">Why is this order <em>counted twice?</em></h2>
        </div>
        <p className="lead">Five rows from an orders-to-shipments join. The revenue tile above it is too high. Find out why, then fix it.</p>
      </div>
      <div className="wrap audit__grid">
        <div className="audit__intro">
          <p className="lead" style={{ marginTop: 0 }}>Compare two rows, reveal the repeated order, then keep one row per order and watch the total change.</p>
          <div className="audit__actions">
            <button type="button" className="btn btn--ghost" onClick={reveal} disabled={revealed}>Show the repeated order</button>
            <button type="button" className="btn btn--accent" onClick={fix} disabled={!revealed || fixed}>Keep one row per order <Arrow /></button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Reset</button>
          </div>
          <p className="audit__msg" aria-live="polite">{compare}</p>
          <p className="sr" aria-live="polite">{status}</p>
          <p className="audit__note">
            Before I build a report, I check what one row means. Here a row is a shipment, not an order.
            <span>Kurian · on checking the grain</span>
          </p>
        </div>

        <div className="console" translate="no">
          <div className="console__bar">
            <span>orders_x_shipments</span>
            <span>5 rows · grain: shipment</span>
          </div>
          <table>
            <caption className="sr">Orders joined to shipments. Use the row buttons to compare two rows.</caption>
            <thead>
              <tr>
                <th className="pick" scope="col"><span className="sr">Compare</span></th>
                <th scope="col">order_id</th>
                <th scope="col">shipment_id</th>
                <th scope="col" className="num">order_total ₹</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_ROWS.map((r, i) => {
                const n = i + 1;
                const repeat = seen.has(r.order);
                seen.add(r.order);
                return (
                  <tr key={n} data-sel={picked.includes(n)} data-dup={revealed && r.order === dupId} data-removed={fixed && repeat}>
                    <td className="pick">
                      <button type="button" className="rowbtn" aria-pressed={picked.includes(n)} aria-label={`Compare row ${n}`} onClick={() => toggle(n)}>{n}</button>
                    </td>
                    <td className="oid">{r.order}</td>
                    <td>{r.shipment}</td>
                    <td className="num">{r.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="console__foot">
            <div className={fixed ? "off" : "on"}>
              <div className="k">Revenue as reported</div>
              <div className="v">{fmt(naive)}</div>
            </div>
            <div className={fixed ? "on" : "off"}>
              <div className="k">One row per order</div>
              <div className="v" id="audit-fixed">{fixed ? fmt(dedup) : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
