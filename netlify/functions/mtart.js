// API de persistencia para configuraciones de Tipo de Material (MTART).
// Usa Netlify Blobs: almacenamiento clave-valor incluido en el sitio de Netlify,
// sin necesidad de contratar/configurar una base de datos aparte.
import { getStore } from "@netlify/blobs";

function cors(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") return cors({}, 204);

  const store = getStore("verificador-producto");
  const url = new URL(req.url);

  try {
    if (req.method === "GET") {
      const { blobs } = await store.list({ prefix: "mtart:" });
      const result = {};
      for (const b of blobs) {
        const code = b.key.slice("mtart:".length);
        result[code] = await store.get(b.key, { type: "json" });
      }
      return cors(result);
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { code, fileName, data } = body || {};
      if (!code || !data) return cors({ error: "code y data son requeridos" }, 400);
      const record = {
        fileName: fileName || (code + ".json"),
        importedAt: new Date().toISOString(),
        data
      };
      await store.setJSON("mtart:" + code, record);
      return cors(record);
    }

    if (req.method === "DELETE") {
      const code = url.searchParams.get("code");
      if (!code) return cors({ error: "code requerido" }, 400);
      await store.delete("mtart:" + code);
      return cors({ ok: true });
    }

    return cors({ error: "Método no permitido" }, 405);
  } catch (err) {
    return cors({ error: String(err && err.message || err) }, 500);
  }
};

export const config = { path: "/api/mtart" };
