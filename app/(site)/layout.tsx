import { CommandPalette } from "@/components/chrome/command-palette";
import { CustomCursor } from "@/components/chrome/cursor";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { PwaTabs } from "@/components/chrome/pwa-tabs";
import { Intro } from "@/components/chrome/intro";
import { Konami } from "@/components/chrome/konami";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <div className="orb" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="site-layer">
        <ScrollProgress />
        <CustomCursor />
        <Intro />
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <PwaTabs />
        <CommandPalette />
        <Konami />
      </div>
    </SmoothScroll>
  );
}
