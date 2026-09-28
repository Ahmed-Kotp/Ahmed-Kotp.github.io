import { getProfile, getUi } from "@/lib/data";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Ahmed Kotp — Senior React Native Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const profile = getProfile();
  const ui = getUi();
  const users = profile.stats.find((stat) => stat.id === "users");
  const apps = profile.stats.find((stat) => stat.id === "apps");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070b",
          color: "#f6f3ec",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#ddd6fe" }}>{ui.seo.siteName.toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 0.95, fontWeight: 700 }}>{profile.name}</div>
          <div style={{ marginTop: 18, fontSize: 32, color: "#22d3ee" }}>{profile.title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#c4c0d2" }}>
          {profile.location} · {apps?.value}
          {apps?.suffix} production apps · {users?.value}
          {users?.suffix} users
        </div>
      </div>
    ),
    { ...size },
  );
}
