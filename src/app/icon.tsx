import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { readPretendard } from "@/lib/ogFont";

export const size = {
  width: 32,
  height: 32
};

export const contentType = "image/png";

export default async function Icon() {
  const font = await readPretendard();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "#0071E3",
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 700
        }}
      >
        {profile.name.charAt(0)}
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] }
  );
}
