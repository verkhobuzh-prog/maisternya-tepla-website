// Приймає сповіщення від Netlify Forms (форма "quick-review-form")
// і зберігає кожен новий відгук у Netlify Blobs зі статусом "pending".
//
// Налаштування (робиться один раз у Netlify UI):
// Site settings → Forms → Form notifications → Add notification →
// Outgoing webhook → Form: quick-review-form
// URL: https://ВАШ_САЙТ.netlify.app/api/review-webhook

import { getStore } from "@netlify/blobs";

// Netlify не завжди надсилає групу чекбоксів під одним і тим самим ключем —
// залежно від того, як саме форма була відправлена (звичайний сабміт,
// AJAX, мобільний браузер тощо), ключ може бути "impressions[]",
// "impressions", а значення — масивом або рядком через кому.
// Ця функція перебирає усі відомі варіанти й повертає завжди масив рядків.
function extractImpressions(data) {
  const candidates = [
    data["impressions[]"],
    data["impressions"],
    data["Impressions"],
    data["impressions[]".toLowerCase()],
  ];

  for (const value of candidates) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      const cleaned = value.map((v) => String(v).trim()).filter(Boolean);
      if (cleaned.length) return cleaned;
      continue;
    }

    if (typeof value === "string" && value.trim()) {
      // Іноді значення приходить одним рядком, розділеним комами
      const parts = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (parts.length) return parts;
    }
  }

  return [];
}

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
  const impressions = extractImpressions(data);

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
