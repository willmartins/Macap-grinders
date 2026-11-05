import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function brandOpenGraph(title: string, line: string) {
  const svg = await readFile(join(process.cwd(), "public/brand/macap-logo-white.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  const heading = title.length > 72 ? `${title.slice(0, 69).trim()}...` : title;
  const detail = line.length > 140 ? `${line.slice(0, 137).trim()}...` : line;
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
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", width: "72px", height: "6px", background: "#FFC600", marginBottom: "36px" }} />
        <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: "980px" }}>{heading}</div>
        <div style={{ fontSize: 28, lineHeight: 1.35, marginTop: "28px", maxWidth: "860px", color: "#E4E4E4" }}>{detail}</div>
        {/* next/og paints this inside ImageResponse. next/image cannot run there. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={220} height={38} alt="" style={{ marginTop: "48px" }} />
      </div>
    ),
    { ...ogSize },
  );
}
