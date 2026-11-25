import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/content";
import CaseHero from "@/components/CaseHero";
import ProjectArt from "@/components/ProjectArt";

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
      images: ["/share.jpg"],
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
        <div className="case__shot" style={{ aspectRatio: "16 / 7", position: "relative" }}>
          <ProjectArt project={p} />
        </div>
      </CaseHero>

      <div className="wrap">
        {p.dashboard && (
          <a className="btn btn--accent" style={{ marginTop: 16 }} href={p.dashboard} target="_blank" rel="noopener noreferrer">Open the live dashboard ↗</a>
        )}

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
