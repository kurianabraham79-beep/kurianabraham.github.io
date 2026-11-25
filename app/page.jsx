import Hero from "@/components/Hero";
import Lineage from "@/components/Lineage";
import Work from "@/components/Work";
import Audit from "@/components/Audit";
import { Marquee, Capabilities, Process, Contact } from "@/components/Sections";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Marquee />
      <Lineage />
      <Work />
      <Audit />
      <Capabilities />
      <Process />
      <Contact />
    </main>
  );
}
