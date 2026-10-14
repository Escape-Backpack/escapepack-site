/* Apply before styles paint; remember an explicit choice, otherwise follow the device. */
(() => {
  const key = "bureau-clue-theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let choice;
  try { const saved = localStorage.getItem(key); if (saved === "dark" || saved === "light") choice = saved; } catch {}
  function apply() {
    const dark = choice ? choice === "dark" : system.matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const button = document.getElementById("theme-toggle");
    if (button) { button.hidden = false; button.setAttribute("aria-pressed", String(dark)); }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#20191d" : "#542C3B");
  }
  apply();
  system.addEventListener("change", apply);
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    button.addEventListener("click", () => {
      choice = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, choice); } catch {}
      apply();
    });
    apply();
  });
})();
