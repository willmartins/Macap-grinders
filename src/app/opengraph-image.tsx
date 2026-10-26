import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#000000",
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 72, lineHeight: 1 }}>Macap</div>
        <div style={{ fontSize: 32, marginTop: 24 }}>Coffee grinders, made in Italy.</div>
      </div>
    ),
    { ...size },
  );
}
