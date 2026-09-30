// Light/dark toggle. Shares the "ebp-theme" choice with the design boards (same origin).
// No choice stored = follow the OS setting; the CSS handles that part.
(function () {
  var KEY = "ebp-theme", root = document.documentElement;
  function isDark() { return root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
  var host = document.querySelector(".main-nav") || document.querySelector(".header-inner");
  if (!host) return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  function label() { var d = isDark(); btn.textContent = d ? "Light mode" : "Dark mode"; btn.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode"); }
  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    label();
  });
  label();
  host.appendChild(btn);
})();
