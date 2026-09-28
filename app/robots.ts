import { getUi } from "@/lib/data";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const ui = getUi();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${ui.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: ui.siteUrl,
  };
}
