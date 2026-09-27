/* Draft event names. Cloudflare Web Analytics handles page views separately.
   Custom events are sent only after Zaraz is enabled on the deployed site. */
window.EscapeAnalytics = {
  track(name, properties = {}) {
    if (!window.zaraz || typeof window.zaraz.track !== "function") return;
    try { window.zaraz.track(name, properties); } catch (_) { /* Analytics must never block play. */ }
  }
};

document.addEventListener("click", event => {
  const link = event.target.closest("[data-track]");
  if (!link) return;
  window.EscapeAnalytics.track(link.dataset.track, {game: link.dataset.game || "hiking"});
});
