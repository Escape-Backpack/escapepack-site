// Small page touches for the Cryptic Bureau pages: redaction bars lift on click, Enter or Space.
document.querySelectorAll(".redact").forEach(function (el) {
  var label = el.getAttribute("data-label") || "Redacted. Select to reveal";
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", label);
  function reveal() {
    if (el.classList.contains("shown")) return;
    el.classList.add("shown");
    el.removeAttribute("role");
    el.removeAttribute("tabindex");
    el.removeAttribute("aria-label");
    if (window.EscapeAnalytics) window.EscapeAnalytics.track("redaction_lifted", { game: "bureau" });
  }
  el.addEventListener("click", reveal);
  el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } });
});
