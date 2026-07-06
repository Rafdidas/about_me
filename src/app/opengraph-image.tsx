import { ImageResponse } from "next/og";
import { siteMeta } from "@/data/site";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fafc",
          color: "#0f172a",
          padding: 72,
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>박현규</div>
          <div style={{ fontSize: 24, color: "#2563eb", fontWeight: 700 }}>UI Publisher</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, fontWeight: 800, maxWidth: 920 }}>
            화면 구현을 넘어 반복되는 UI를 정리합니다.
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.45, color: "#475569", maxWidth: 900 }}>{siteMeta.description}</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#334155" }}>
          <span>Design System</span>
          <span>·</span>
          <span>B2B Admin UI</span>
          <span>·</span>
          <span>Responsive UI</span>
        </div>
      </div>
    ),
    size
  );
}
