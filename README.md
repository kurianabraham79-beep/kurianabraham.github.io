# kurianabraham.site

Portfolio of Kurian Abraham, data engineer and analyst. Next.js (static export) with GSAP.

```bash
npm install
npm run dev      # local preview at http://localhost:3000
npm run build    # static site in ./out
```

- Content (projects, stages, capabilities, process, audit rows): `lib/content.js`
- Sections: `components/` · pages: `app/` (case studies in `app/work/[slug]`)
- Animation: GSAP with ScrollTrigger, SplitText and DrawSVG, all through `useGSAP`; every animation
  is wrapped in `prefers-reduced-motion: no-preference`, so reduced-motion visitors get a still page.
- Deploy: pushing to `main` runs `.github/workflows/deploy.yml`, which builds `./out` and publishes it
  to GitHub Pages (Settings → Pages → Source must be "GitHub Actions"). The custom domain is kept by
  `public/CNAME`.
- To add a live Power BI link to a case study, give that project a `dashboard` URL in `lib/content.js`.
