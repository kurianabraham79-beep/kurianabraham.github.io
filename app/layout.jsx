import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { PERSON } from "@/lib/content";
import Nav from "@/components/Nav";

export const metadata = {
  metadataBase: new URL(PERSON.url),
  title: {
    default: "Kurian Abraham — Data engineer & analyst",
    template: "%s — Kurian Abraham",
  },
  description:
    "Kurian Abraham builds the pipelines, models and Power BI dashboards behind business decisions, and traces every number back to the row it came from.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Kurian Abraham — Data engineer & analyst",
    description: "Pipelines, data quality and Power BI dashboards you can trace back to the source.",
    images: ["/share.jpg"],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  url: PERSON.url,
  jobTitle: "Data Engineer & Analyst",
  email: PERSON.email,
  knowsAbout: ["Data Engineering", "SQL", "Python", "PySpark", "Power BI", "Data Analytics"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
