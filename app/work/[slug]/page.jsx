import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/content";
import CaseHero from "@/components/CaseHero";
import { ConceptArt } from "@/components/Work";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title}${p.concept ? " (concept)" : ""}`,
    description: p.question,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: {
      title: `${p.title} — Kurian Abraham`,
      description: p.question,
      url: `/work/${p.slug}/`,
      images: [p.image ? `/img/${p.image}-1200.webp` : "/share.jpg"],
    },
  };
}

export default async function CasePage({ params }) {
  const { slug } = await params;
  const i = PROJECTS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = PROJECTS[i];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <main id="main" className="case">
      <CaseHero project={p}>
        {p.image ? (
          <figure className="case__shot">
            <img
              src={`/img/${p.image}-1200.webp`}
              srcSet={`/img/${p.image}-700.webp 700w, /img/${p.image}-1200.webp 1200w, /img/${p.image}.webp 1693w`}
              sizes="(max-width: 1440px) 92vw, 1300px"
              width="1693"
              height="929"
              alt={p.alt}
              fetchPriority="high"
            />
          </figure>
        ) : (
          <div className="case__shot" style={{ aspectRatio: "16 / 7", position: "relative" }}>
            <ConceptArt />
          </div>
        )}
      </CaseHero>

      <div className="wrap">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          {p.dashboard && (
            <a className="btn btn--accent" href={p.dashboard} target="_blank" rel="noopener noreferrer">Open the live dashboard ↗</a>
          )}
          {p.full && (
            <a className="case__full" href={encodeURI(p.full)}>See the full-size screenshot ↗</a>
          )}
        </div>

        <div className="case__body">
          <h2>The business question</h2>
          <p className="case__q">{p.question}</p>

          <h2>What I built</h2>
          <ol className="case__list">{p.built.map((b) => <li key={b}>{b}</li>)}</ol>

          <h2>What you can investigate</h2>
          <ol className="case__list">{p.investigate.map((b) => <li key={b}>{b}</li>)}</ol>
        </div>

        <nav className="case__next" aria-label="More projects">
          <a href={`/work/${prev.slug}/`}><small>Previous project</small><span>{prev.title}</span></a>
          <a href={`/work/${next.slug}/`}><small>Next project</small><span>{next.title}</span></a>
        </nav>
      </div>

      <footer className="footer">
        <div className="wrap footer__in">
          <span>© 2026 Kurian Abraham · <a href="mailto:contact@kurianabraham.site?subject=Discuss%20a%20project">contact@kurianabraham.site</a></span>
          <a href="/#contact">Get in touch →</a>
        </div>
      </footer>
    </main>
  );
}
