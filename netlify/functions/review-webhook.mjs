// Приймає сповіщення від Netlify Forms (форма "quick-review-form")
// і зберігає кожен новий відгук у Netlify Blobs зі статусом "pending".
//
// Налаштування (робиться один раз у Netlify UI):
// Site settings → Forms → Form notifications → Add notification →
// Outgoing webhook → Form: quick-review-form
// URL: https://ВАШ_САЙТ.netlify.app/api/review-webhook

import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  // Реагуємо тільки на форму відгуків, не на форму запису
  if (payload.form_name !== "quick-review-form") {
    return new Response("ignored", { status: 200 });
  }

  const data = payload.data || {};
  const id = String(payload.id || crypto.randomUUID());

  const rawImpressions = data["impressions[]"];
  const impressions = Array.isArray(rawImpressions)
    ? rawImpressions
    : rawImpressions
      ? [rawImpressions]
      : [];

  const review = {
    id,
    name: (data.name || "Анонім").toString().slice(0, 100),
    comment: (data.custom_comment || "").toString().slice(0, 1000),
    impressions,
    createdAt: payload.created_at || new Date().toISOString(),
    status: "pending", // pending | approved | rejected
  };

  const store = getStore("reviews");
  await store.setJSON(id, review);

  return new Response("ok", { status: 200 });
};

export const config = { path: "/api/review-webhook" };
