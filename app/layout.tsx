import { SiteAnalytics } from "@/components/chrome/analytics";
import { RegisterPwa } from "@/components/chrome/register-pwa";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProfile, getUi } from "@/lib/data";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const themeBoot = `(function(){try{var t=localStorage.getItem("theme");var r=document.documentElement;r.lang="en";r.dir="ltr";localStorage.removeItem("locale");r.classList.add(t==="light"?"light":"dark");var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(sessionStorage.getItem("ak-intro")==="1"||reduce){r.dataset.intro="done";}}catch(e){document.documentElement.classList.add("dark");}})();`;

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateMetadata(): Metadata {
  const ui = getUi();
  const profile = getProfile();
  return {
    metadataBase: new URL(ui.siteUrl),
    title: {
      default: ui.seo.title,
      template: `%s · ${ui.seo.siteName}`,
    },
    description: ui.seo.description,
    keywords: ui.seo.keywords,
    authors: [{ name: profile.name, url: ui.siteUrl }],
    creator: profile.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: ui.siteUrl,
      title: ui.seo.title,
      description: ui.seo.description,
      siteName: ui.seo.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: ui.seo.title,
      description: ui.seo.description,
    },
    robots: { index: true, follow: true },
    applicationName: ui.seo.siteName,
    appleWebApp: {
      capable: true,
      title: ui.seo.siteName,
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ui = getUi();
  const profile = getProfile();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    image: new URL(profile.portrait, ui.siteUrl).toString(),
    url: ui.siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Giza",
      addressCountry: "EG",
    },
    description: profile.summary,
    knowsAbout: ["React Native", "Expo", "TypeScript", "Retrieval-Augmented Generation"],
    sameAs: profile.socials.filter((social) => social.url.startsWith("http")).map((social) => social.url),
    knowsLanguage: profile.languages.map((language) => language.name),
  };

  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <noscript>
          <style>{`html{overflow:auto !important}.intro-overlay{display:none !important}`}</style>
        </noscript>
        <ThemeProvider>
          <LocaleProvider>
            <TooltipProvider>
              {children}
              <SiteAnalytics />
              <RegisterPwa />
            </TooltipProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
