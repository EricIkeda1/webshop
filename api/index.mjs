import { handleApi } from "../server/api.mjs";

/** Preserve the public API path after a Vercel rewrite. */
export function normalizeVercelRequest(request) {
  const url = new URL(request.url || "/", "http://localhost");
  const forwarded =
    request.query?._eyi_path ?? url.searchParams.get("_eyi_path");
  if (forwarded !== null && forwarded !== undefined) {
    const path = (
      Array.isArray(forwarded) ? forwarded.join("/") : String(forwarded)
    ).replace(/^\/+/, "");
    if (!/^[a-zA-Z0-9/-]+$/.test(path)) throw new Error("Invalid API path");
    url.pathname = `/api/${path}`;
  }
  url.searchParams.delete("_eyi_path");
  request.url = url.pathname + url.search;
}

export default async function handler(request, response) {
  try {
    normalizeVercelRequest(request);
    const handled = await handleApi(request, response);
    if (!handled) {
      response.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify({ message: "Recurso não encontrado." }));
    }
  } catch {
    if (!response.headersSent)
      response.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
    response.end(
      JSON.stringify({ message: "Não foi possível atender à solicitação." }),
    );
  }
}
