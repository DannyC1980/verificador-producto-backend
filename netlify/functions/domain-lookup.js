// API de persistencia para la Lista de Valores (DOMAIN_LOOKUP) del artefacto.
// Un único registro en Netlify Blobs con todo el objeto.
import { getStore } from "@netlify/blobs";

function cors(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") return cors({}, 204);

  const store = getStore("verificador-producto");

  try {
    if (req.method === "GET") {
      const data = await store.get("domain-lookup", { type: "json" });
      return cors(data || {});
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (!body || typeof body !== "object") return cors({ error: "cuerpo JSON inválido" }, 400);
      await store.setJSON("domain-lookup", body);
      return cors({ ok: true, campos: Object.keys(body).length });
    }

    return cors({ error: "Método no permitido" }, 405);
  } catch (err) {
    return cors({ error: String(err && err.message || err) }, 500);
  }
};

export const config = { path: "/api/domain-lookup" };
