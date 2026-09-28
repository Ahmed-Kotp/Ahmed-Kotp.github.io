"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("flex max-w-full gap-2 overflow-x-auto pb-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors data-[state=active]:border-transparent data-[state=active]:bg-foreground data-[state=active]:text-background",
        className,
      )}
      {...props}
    />
  );
}
