"use client";

import { buttonVariants } from "@/components/ui/button";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className={`${buttonVariants({ variant: "primary", size: "sm" })} no-print`} onClick={() => window.print()}>
      {label}
    </button>
  );
}
