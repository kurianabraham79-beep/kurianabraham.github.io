/* Line drawings for each project, in the site's own palette (ink lines, one lime accent, mono labels).
   The figures are taken from Kurian's own dashboards; the concept shows its four stages. */

const INK = "#ede8de";
const ACC = "#c8f560";
const MONO = "var(--mono)";
const SERIF = "var(--serif)";

const Label = ({ x, y, children, a = "start", o = 0.5, s = 13, c = INK }) => (
  <text className={s <= 12 ? "fine" : undefined} x={x} y={y} textAnchor={a} fill={c} fillOpacity={o} fontFamily={MONO} fontSize={s}>{children}</text>
);
const Big = ({ x, y, children, c = INK, s = 40 }) => (
  <text x={x} y={y} fill={c} fontFamily={SERIF} fontSize={s} letterSpacing="-0.5">{children}</text>
);

/* Product Sales & Revenue: the KPI row, the monthly sales line, and sales by category */
function Sales() {
  const pts = [8, 13, 15, 15, 23, 24, 21, 19, 28, 18, 21, 26, 18, 27, 15, 22, 21, 17, 25, 19, 23];
  const x0 = 40, x1 = 560, y0 = 340, h = 150;
  const step = (x1 - x0) / (pts.length - 1);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(x0 + i * step).toFixed(1)} ${(y0 - (v / 30) * h).toFixed(1)}`).join(" ");
  const cats = [["Technology", 33.6], ["Furniture", 28.4], ["Office Supplies", 21.7], ["Others", 16.3]];
  return (
    <svg viewBox="0 0 900 400" aria-hidden="true">
      <Label x={40} y={56}>TOTAL SALES</Label>
      <Big x={40} y={100} c={ACC}>₹2.45 Cr</Big>
      <Label x={250} y={56}>ORDERS</Label>
      <Big x={250} y={100}>5,842</Big>
      <Label x={420} y={56}>AVG ORDER</Label>
      <Big x={420} y={100}>₹4,198</Big>
      {[0, 1, 2, 3].map((k) => <line key={k} x1={x0} x2={x1} y1={y0 - k * 50} y2={y0 - k * 50} stroke={INK} strokeOpacity="0.08" />)}
      <path d={`${d} L${x1} ${y0} L${x0} ${y0} Z`} fill={ACC} fillOpacity="0.06" />
      <path d={d} fill="none" stroke={ACC} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {["Jan", "Apr", "Jul", "Oct", "Dec"].map((m, i) => <Label key={m} x={x0 + i * 130} y={368} s={11} o={0.4}>{m}</Label>)}
      <Label x={620} y={170} s={11}>SALES BY CATEGORY</Label>
      {cats.map(([n, v], i) => (
        <g key={n}>
          <Label x={620} y={204 + i * 40} s={12} o={0.7}>{n}</Label>
          <rect x={620} y={212 + i * 40} width={240} height={6} rx={3} fill={INK} fillOpacity="0.08" />
          <rect x={620} y={212 + i * 40} width={(v / 33.6) * 240} height={6} rx={3} fill={i === 0 ? ACC : INK} fillOpacity={i === 0 ? 1 : 0.45} />
          <Label x={860} y={204 + i * 40} a="end" s={12} o={0.7}>{v}%</Label>
        </g>
      ))}
    </svg>
  );
}

/* Campaign Performance: the funnel, conversions by channel, and ROI */
function Campaign() {
  const funnel = [["Impressions", "3.25M", 300], ["Clicks", "162.3K", 220], ["Conversions", "8,734", 140]];
  const ch = [["Paid Search", 34.2], ["Social Media", 28.7], ["Email", 17.6], ["Display Ads", 11.8], ["Others", 7.7]];
  return (
    <svg viewBox="0 0 900 400" aria-hidden="true">
      <Label x={40} y={56}>FUNNEL</Label>
      {funnel.map(([n, v, w], i) => (
        <g key={n}>
          <rect x={40 + (300 - w) / 2} y={80 + i * 74} width={w} height={56} rx={10} fill={i === 2 ? ACC : "#171b21"} stroke={INK} strokeOpacity={i === 2 ? 0 : 0.25} />
          <text x={190} y={104 + i * 74} textAnchor="middle" fill={i === 2 ? "#0b0d10" : INK} fillOpacity="0.75" fontFamily={MONO} fontSize="12">{n}</text>
          <text x={190} y={124 + i * 74} textAnchor="middle" fill={i === 2 ? "#0b0d10" : INK} fontFamily={SERIF} fontSize="20">{v}</text>
        </g>
      ))}
      <Label x={400} y={56}>CONVERSIONS BY CHANNEL</Label>
      {ch.map(([n, v], i) => (
        <g key={n}>
          <Label x={400} y={96 + i * 44} s={12} o={0.7}>{n}</Label>
          <rect x={400} y={104 + i * 44} width={300} height={6} rx={3} fill={INK} fillOpacity="0.08" />
          <rect x={400} y={104 + i * 44} width={(v / 34.2) * 300} height={6} rx={3} fill={i === 0 ? ACC : INK} fillOpacity={i === 0 ? 1 : 0.45} />
          <Label x={700} y={96 + i * 44} a="end" s={12} o={0.7}>{v}%</Label>
        </g>
      ))}
      <Label x={750} y={56}>ROI</Label>
      <Big x={750} y={104} c={ACC} s={48}>342%</Big>
      <Label x={750} y={140} s={11} o={0.4}>CTR 4.99%</Label>
      <Label x={750} y={162} s={11} o={0.4}>CVR 5.38%</Label>
    </svg>
  );
}

/* Claims & Revenue Cycle: the KPI row and claims by status as one stacked bar, then the claim's path */
function Claims() {
  const status = [["Paid", 52.1], ["Pending", 28.7], ["Denied", 7.4], ["Under review", 6.3], ["Rejected", 5.5]];
  let x = 40;
  const W = 820;
  return (
    <svg viewBox="0 0 900 400" aria-hidden="true">
      <Label x={40} y={56}>TOTAL CLAIMS</Label>
      <Big x={40} y={100}>18,742</Big>
      <Label x={260} y={56}>COLLECTION RATE</Label>
      <Big x={260} y={100} c={ACC}>58.86%</Big>
      <Label x={520} y={56}>DENIAL RATE</Label>
      <Big x={520} y={100}>7.42%</Big>
      <Label x={710} y={56}>DAYS IN AR</Label>
      <Big x={710} y={100}>36.4</Big>
      <Label x={40} y={160} s={11}>CLAIMS BY STATUS</Label>
      {status.map(([n, v], i) => {
        const w = (v / 100) * W;
        const g = (
          <g key={n}>
            <rect x={x} y={176} width={Math.max(w - 4, 2)} height={28} rx={6} fill={i === 0 ? ACC : INK} fillOpacity={i === 0 ? 1 : 0.18 + 0.1 * (4 - i)} />
            {v > 20 && <Label x={x + 8} y={226} s={11} o={0.6}>{n} {v}%</Label>}
          </g>
        );
        x += w;
        return g;
      })}
      <Label x={860} y={250} a="end" s={11} o={0.6}>Denied 7.4% · Under review 6.3% · Rejected 5.5%</Label>
      {["Submitted", "Adjudicated", "Paid"].map((n, i) => (
        <g key={n}>
          <rect x={40 + i * 200} y={282} width={150} height={44} rx={10} fill="#171b21" stroke={i === 2 ? ACC : INK} strokeOpacity={i === 2 ? 1 : 0.3} />
          <text x={115 + i * 200} y={309} textAnchor="middle" fill={INK} fontFamily={MONO} fontSize="13">{n}</text>
          {i < 2 && <path d={`M${190 + i * 200} 304 H ${240 + i * 200}`} stroke={INK} strokeOpacity="0.4" />}
        </g>
      ))}
      <path d="M465 326 C 480 360, 560 364, 610 352" fill="none" stroke="#ff8a5b" strokeOpacity="0.8" strokeDasharray="4 4" />
      <Label x={630} y={356} s={12} c="#ff8a5b" o={0.9}>denied → appeal</Label>
    </svg>
  );
}

/* Fraud Analytics Data Platform (concept): sources into the four stages */
function Concept() {
  const nodes = ["Ingest", "Transform", "Validate", "Serve"];
  return (
    <svg viewBox="0 0 900 400" aria-hidden="true">
      {["Files", "APIs", "Source systems"].map((s, i) => (
        <g key={s}>
          <rect x="40" y={92 + i * 80} width="150" height="44" rx="10" fill="none" stroke={INK} strokeOpacity="0.35" strokeDasharray="4 4" />
          <text x="115" y={119 + i * 80} textAnchor="middle" fill={INK} fillOpacity="0.7" fontFamily={MONO} fontSize="15">{s}</text>
          <path d={`M190 ${114 + i * 80} C 240 ${114 + i * 80}, 230 194, 270 194`} fill="none" stroke={INK} strokeOpacity="0.3" />
        </g>
      ))}
      {nodes.map((n, i) => (
        <g key={n}>
          <rect x={270 + i * 155} y="170" width="130" height="48" rx="12" fill={i === 3 ? ACC : "#171b21"} stroke={i === 2 ? ACC : INK} strokeOpacity={i === 2 ? 1 : 0.35} />
          <text x={335 + i * 155} y="200" textAnchor="middle" fill={i === 3 ? "#0b0d10" : INK} fontFamily={MONO} fontSize="15">{n}</text>
          {i < 3 && <path d={`M${400 + i * 155} 194 H ${425 + i * 155}`} stroke={INK} strokeOpacity="0.4" />}
        </g>
      ))}
      <text x="335" y="262" fill={INK} fillOpacity="0.4" fontFamily={MONO} fontSize="13">SQL · Python · PySpark → schema · rules → data models · Power BI</text>
    </svg>
  );
}

const ART = { "product-sales": Sales, "campaign-performance": Campaign, "claims-revenue-cycle": Claims, "fraud-data-platform": Concept };

export default function ProjectArt({ project }) {
  const Art = ART[project.slug] || Concept;
  return (
    <div className="concept-art" role="img" aria-label={project.artLabel}>
      <Art />
    </div>
  );
}
