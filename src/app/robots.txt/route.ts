import { isIndexingAllowed } from "@/lib/indexing";
import { getSiteUrl } from "@/lib/site";

export async function GET(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const allow = isIndexingAllowed(host);
  const lines = allow
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /studio",
        "Disallow: /api",
        "",
        `Sitemap: ${new URL("/sitemap.xml", getSiteUrl()).toString()}`,
        "",
      ]
    : ["User-agent: *", "Disallow: /", ""];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      Vary: "Host",
    },
  });
}
