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
          background: "#F7F0F5",
          color: "#433633",
          padding: 96,
          fontFamily: "Pretendard"
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: "#A0522D" }}>{profile.role}</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>{profile.name}</div>
        <div style={{ fontSize: 36, lineHeight: 1.5, maxWidth: 1000, wordBreak: "keep-all" }}>{profile.headline}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] }
  );
}
