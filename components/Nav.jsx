"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mailto } from "@/lib/content";
import { Mark } from "./Icons";

const LINKS = [
  { id: "lineage", label: "Method" },
  { id: "work", label: "Work" },
  { id: "audit", label: "Audit" },
  { id: "contact", label: "Contact" },
];

/** Fixed bar: hides while scrolling down, returns on the way up, marks the section on screen. */
export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!home || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [home]);

  return (
    <header className="nav" data-scrolled={scrolled} data-hidden={hidden} onFocusCapture={() => setHidden(false)}>
      <div className="wrap nav__in">
        <Link className="nav__logo" href="/" aria-label="Kurian Abraham, home">
          <Mark />
          <span>Kurian Abraham</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={home ? `#${l.id}` : `/#${l.id}`} aria-current={current === l.id ? "true" : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--accent" href={mailto("role")}>
          Email Kurian
        </a>
      </div>
    </header>
  );
}
