import { About } from "@/components/about/about";
import { Contact } from "@/components/contact/contact";
import { Education } from "@/components/education/education";
import { Experience } from "@/components/experience/experience";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { Skills } from "@/components/skills/skills";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
    </>
  );
}
