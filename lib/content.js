// Everything on the site comes from Kurian's own material: his previous site, his three Power BI
// dashboards (screenshots in /public) and his contact details. Nothing here is an invented claim.

export const PERSON = {
  name: "Kurian Abraham",
  role: "Data engineer & analyst",
  email: "contact@kurianabraham.site",
  status: "Available for remote projects",
  url: "https://kurianabraham.site",
};

export const SUBJECTS = {
  role: "Discuss a role",
  project: "Discuss a project",
};

export const mailto = (topic = "role") =>
  `mailto:${PERSON.email}?subject=${encodeURIComponent(SUBJECTS[topic])}`;

/** The reference pipeline from his site: the four stages every project passes through. */
export const STAGES = [
  {
    id: "ingest",
    n: "01",
    name: "Ingest",
    tools: "Files · APIs · Source systems",
    line: "Data arrives the way it was written: strings for numbers, stray spaces, one order spread across shipments.",
  },
  {
    id: "transform",
    n: "02",
    name: "Transform",
    tools: "SQL · Python · PySpark",
    line: "Types are cast, text is cleaned, and the record takes the shape the model expects.",
  },
  {
    id: "validate",
    n: "03",
    name: "Validate",
    tools: "Schema · Rules · Data quality",
    line: "Every row is checked against the grain. One order, one row. Anything else stops here, before it reaches a meeting.",
  },
  {
    id: "serve",
    n: "04",
    name: "Serve",
    tools: "Data models · Power BI",
    line: "The number reaches the dashboard with its history attached, so anyone can trace it back.",
  },
];

export const PROJECTS = [
  {
    slug: "product-sales",
    artLabel: "Drawing of the Product Sales and Revenue dashboard: total sales ₹2.45 crore, 5,842 orders, average order ₹4,198, the monthly sales trend, and sales by category led by Technology at 33.6%.",
    no: "01",
    title: "Product Sales & Revenue",
    discipline: "Commercial analytics",
    tool: "Power BI",
    tags: ["Sales", "Revenue", "Product trends"],
    image: "product-sales",
    full: "/1. Product Sales and Revenue Analytics.png",
    concept: false,
    summary: "A sales performance view built to explore revenue patterns, product contribution and business trends in one place.",
    question: "Where does revenue come from, which products contribute to it, and how are the trends moving?",
    built: [
      "A sales performance view that brings revenue patterns, product contribution and business trends into one place.",
      "One Power BI data model underneath, so every measure is defined once and agrees everywhere it appears.",
    ],
    investigate: [
      "Revenue patterns over time",
      "How much each product contributes to the total",
      "How sales and revenue trends are moving",
    ],
    alt: "Kurian's Product Sales and Revenue dashboard in Power BI: total sales, profit, orders, average order value and customers; the sales trend against the previous year; sales by category, region and segment; the top five products; profit against sales.",
  },
  {
    slug: "campaign-performance",
    artLabel: "Drawing of the Marketing Campaign Analytics dashboard: a funnel from 3.25 million impressions to 162.3 thousand clicks to 8,734 conversions, conversions by channel led by Paid Search at 34.2%, and ROI of 342%.",
    no: "02",
    title: "Campaign Performance",
    discipline: "Marketing analytics",
    tool: "Power BI",
    tags: ["CTR", "CPC", "CPA", "ROAS"],
    image: "campaign-performance",
    full: "/2. Marketing Campaign Analytics.png",
    concept: false,
    summary: "Campaign reporting for channel performance, lead generation, conversion efficiency and return on marketing spend.",
    question: "Which channels perform, how efficiently do they turn spend into leads and conversions, and what is the return on marketing spend?",
    built: [
      "Campaign reporting for channel performance, lead generation, conversion efficiency and return on marketing spend.",
      "CTR, CPC, CPA and ROAS side by side for every channel, on one definition each.",
    ],
    investigate: [
      "Channel performance side by side",
      "Lead generation by channel",
      "Conversion efficiency through CTR, CPC and CPA",
      "Return on marketing spend (ROAS)",
    ],
    alt: "Kurian's Marketing Campaign Analytics dashboard in Power BI: campaigns, impressions, clicks, conversions, conversion rate, spend and ROI; performance over time; conversions by channel and device; the funnel; results by objective.",
  },
  {
    slug: "claims-revenue-cycle",
    artLabel: "Drawing of the Claims and RCM Analytics dashboard: 18,742 claims, a 58.86% collection rate, a 7.42% denial rate, 36.4 days in AR, and claims by status with 52.1% paid.",
    no: "03",
    title: "Claims & Revenue Cycle",
    discipline: "Healthcare analytics",
    tool: "Power BI",
    tags: ["Claims", "RCM", "Billing"],
    image: "claims-rcm",
    full: "/3. Claims & RCM Analytics Dashboard.png",
    concept: false,
    summary: "A healthcare reporting view for claims, billing gaps, outstanding amounts and operational performance indicators.",
    question: "Where are claims, billing gaps and outstanding amounts holding back the revenue cycle?",
    built: [
      "A healthcare reporting view for claims, billing gaps, outstanding amounts and operational performance indicators.",
    ],
    investigate: [
      "Claims across the revenue cycle",
      "Billing gaps",
      "Outstanding amounts",
      "Operational performance indicators",
    ],
    alt: "Kurian's Claims and RCM Analytics dashboard in Power BI: total claims, net charges, collections, collection rate, denial rate and days in AR; claims by status; denials by reason; AR aging; collections by payer.",
  },
  {
    slug: "fraud-data-platform",
    artLabel: "Concept pipeline: files, APIs and source systems are ingested, transformed with SQL, Python and PySpark, validated against schema and rules, and served to Power BI.",
    no: "04",
    title: "Fraud Analytics Data Platform",
    discipline: "Data platform",
    tool: "Python · SQL",
    tags: ["Data quality", "Monitoring", "Analysis"],
    image: null,
    full: null,
    concept: true,
    summary: "A case study concept for organising transaction signals, applying quality checks and preparing reliable datasets for analysis.",
    question: "How can transaction signals be organised, checked for quality and prepared as reliable datasets for analysis?",
    built: [
      "A case study concept for organising transaction signals, applying quality checks and preparing reliable datasets for analysis.",
      "Ingest: files, APIs and source systems.",
      "Transform: SQL, Python and PySpark.",
      "Validate: schema, rules and data quality.",
      "Serve: data models and Power BI.",
    ],
    investigate: [
      "How a dataset moves from ingest to serve",
      "Where quality checks and monitoring apply",
      "What a reliable, analysis-ready dataset looks like",
    ],
    alt: null,
  },
];

export const CAPABILITIES = [
  {
    n: "A",
    title: "Power BI & business intelligence",
    body: "Interactive dashboards that make performance visible, KPIs understandable and decisions easier to act on.",
    tools: [
      { name: "Power BI", icon: "/icons/power-bi.svg" },
      { name: "DAX" },
      { name: "Data modelling" },
      { name: "Power Query" },
    ],
  },
  {
    n: "B",
    title: "Data engineering & ETL",
    body: "Reliable ingestion and transformation workflows that bring data together, improve quality and make analytics repeatable.",
    tools: [
      { name: "SQL", icon: "/icons/postgres.svg" },
      { name: "Python", icon: "/icons/python.svg" },
      { name: "PySpark", icon: "/icons/apache-spark.svg", wide: true },
      { name: "AWS", icon: "/icons/aws.svg", wide: true },
    ],
  },
  {
    n: "C",
    title: "Analytics & data strategy",
    body: "Business goals turned into useful metrics, clean models, campaign insights and reporting teams can trust.",
    tools: [{ name: "KPI frameworks" }, { name: "SQL analytics" }, { name: "Data quality" }, { name: "Automation" }],
  },
];

export const PROCESS = [
  { n: "01", verb: "Discover", title: "Understand the problem", body: "Align on goals, users, data sources, definitions and the decisions the solution should support." },
  { n: "02", verb: "Design", title: "Shape the solution", body: "Agree on metrics, data models, pipeline flow, dashboard layout and delivery milestones." },
  { n: "03", verb: "Build", title: "Build and validate", body: "Develop iteratively, test the logic, review outputs together and improve based on feedback." },
  { n: "04", verb: "Hand over", title: "Enable your team", body: "Document the solution, explain key decisions and make the deliverables practical to maintain." },
];

/** Five rows of an orders-to-shipments join: the audit exercise. Totals are summed from these rows. */
export const AUDIT_ROWS = [
  { order: "A-1041", shipment: "S-201", total: 120 },
  { order: "A-1042", shipment: "S-202", total: 85 },
  { order: "A-1043", shipment: "S-203", total: 240 },
  { order: "A-1043", shipment: "S-204", total: 240 },
  { order: "A-1044", shipment: "S-205", total: 60 },
];

export const TOOLS_MARQUEE = ["Power BI", "DAX", "Power Query", "SQL", "Python", "PySpark", "AWS", "Data modelling", "KPI frameworks", "Data quality", "Automation"];
