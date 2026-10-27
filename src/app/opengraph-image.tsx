import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Macap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoWidth = 640;
const logoHeight = Math.round((logoWidth * 114.32) / 670.53);

export default async function OpenGraphImage() {
  const svg = await readFile(join(process.cwd(), "public/brand/macap-logo-white.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
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
          padding: "88px",
        }}
      >
        <img src={src} width={logoWidth} height={logoHeight} alt="" />
        <div style={{ fontSize: 32, marginTop: 40 }}>Coffee grinders, made in Italy.</div>
      </div>
    ),
    { ...size },
  );
}
