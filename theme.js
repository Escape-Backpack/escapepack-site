// Light/dark toggle. Shares the "ebp-theme" choice with the design boards (same origin).
// No choice stored = follow the OS setting; the CSS handles that part.
(function () {
  var KEY = "ebp-theme", root = document.documentElement;
  function isDark() { return root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
  var host = document.querySelector(".main-nav") || document.querySelector(".header-inner");
  if (!host) return;
  var SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>';
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  function label() { var d = isDark(); btn.innerHTML = d ? SUN : MOON; btn.title = d ? "Switch to light mode" : "Switch to dark mode"; btn.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode"); }
  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    label();
  });
  label();
  host.appendChild(btn);
})();
