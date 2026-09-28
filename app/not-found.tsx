import { getDictionary } from "@/lib/data";
import Link from "next/link";

export default function NotFound() {
  const dict = getDictionary("en");
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight">This page is not on the map.</h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-foreground px-5 py-3 text-sm text-background">
          {dict.buttons.backHome}
        </Link>
      </div>
    </main>
  );
}
