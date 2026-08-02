// Публічний ендпоінт: віддає тільки схвалені відгуки.
// Саме цей endpoint підтягує reviews-widget.js на сайті.

import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("reviews");
  const { blobs } = await store.list();
  const all = (
    await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))
  ).filter(Boolean);

  const approved = all
    .filter((r) => r.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ name, comment, impressions }) => ({ name, comment, impressions }));

  return new Response(JSON.stringify(approved), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=300",
    },
  });
};

export const config = { path: "/api/reviews-public" };
