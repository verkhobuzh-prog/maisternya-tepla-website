// Захищений паролем API для сторінки модерації (admin.html).
// Пароль встановлюється у Netlify UI:
// Site settings → Environment variables → ADMIN_PASSWORD

import { getStore } from "@netlify/blobs";

function checkPassword(req) {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("password");
  const fromHeader = req.headers.get("x-admin-password");
  const expected = Netlify.env.get("ADMIN_PASSWORD");
  return Boolean(expected) && (fromQuery === expected || fromHeader === expected);
}

export default async (req) => {
  if (!checkPassword(req)) {
    return new Response(JSON.stringify({ error: "Невірний пароль" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore("reviews");

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const reviews = (
      await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))
    ).filter(Boolean);
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return new Response(JSON.stringify(reviews), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return new Response(JSON.stringify({ error: "Некоректні дані" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const review = await store.get(id, { type: "json" });
    if (!review) {
      return new Response(JSON.stringify({ error: "Відгук не знайдено" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    review.status = status;
    await store.setJSON(id, review);
    return new Response(JSON.stringify(review), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "DELETE") {
    const body = await req.json();
    if (!body.id) {
      return new Response(JSON.stringify({ error: "Немає id" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await store.delete(body.id);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/reviews-admin" };
