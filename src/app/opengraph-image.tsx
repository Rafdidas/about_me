import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { readPretendard } from "@/lib/ogFont";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function Image() {
  const font = await readPretendard();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          background: "#F5F5F7",
          color: "#1D1D1F",
          padding: 96,
          fontFamily: "Pretendard"
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0071E3" }}>{profile.role}</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>{profile.name}</div>
        <div style={{ fontSize: 36, lineHeight: 1.5, maxWidth: 1000, wordBreak: "keep-all" }}>{profile.headline}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] }
  );
}
