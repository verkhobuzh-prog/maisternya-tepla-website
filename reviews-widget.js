// Підтягує схвалені відгуки з /api/reviews-public і додає їх
// у блок #dynamic-reviews на сторінці. Підключити тегом
// <script src="reviews-widget.js" defer></script> в index.html.

(async function () {
  const container = document.getElementById("dynamic-reviews");
  if (!container) return;

  try {
    const res = await fetch("/api/reviews-public");
    if (!res.ok) return;
    const reviews = await res.json();

    if (!reviews.length) return;

    const frag = document.createDocumentFragment();
    reviews.forEach((r) => {
      const block = document.createElement("blockquote");
      block.className = "review";

      const p = document.createElement("p");
      p.textContent = r.comment && r.comment.trim()
        ? r.comment.trim()
        : (r.impressions && r.impressions.length ? r.impressions.join(", ") : "");
      block.appendChild(p);

      const cite = document.createElement("cite");
      cite.textContent = r.name || "Клієнт";
      block.appendChild(cite);

      frag.appendChild(block);
    });

    container.appendChild(frag);
  } catch (err) {
    // Тихо ігноруємо помилку мережі — статичні відгуки й так на сторінці
    console.warn("Не вдалося завантажити відгуки:", err);
  }
})();
