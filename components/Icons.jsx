export function Arrow({ className = "arrow", dir = "right" }) {
  const d = dir === "left" ? "M19 12H5M11 6l-6 6 6 6" : dir === "up-right" ? "M7 17 17 7M8 7h9v9" : "M5 12h14M13 6l6 6-6 6";
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#171b21" />
      <path d="M16 46V18M16 32h12l8-14M28 32l8 14" fill="none" stroke="#ede8de" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="32" r="5" fill="#c8f560" />
    </svg>
  );
}
