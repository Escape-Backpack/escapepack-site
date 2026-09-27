document.querySelectorAll("form[data-async-form]").forEach(form => {
  const choice = form.querySelector("[name=intent]");
  const weekField = form.querySelector("[data-week-field]");
  const weekInput = weekField?.querySelector('input[type="week"]');

  if (choice && new URLSearchParams(location.search).get("intent") === "notify") choice.value = "notify";
  if (weekInput) {
    const today = new Date();
    const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
    const year = utc.getUTCFullYear();
    const first = new Date(Date.UTC(year, 0, 1));
    const week = Math.ceil((((utc - first) / 86400000) + 1) / 7);
    weekInput.min = `${year}-W${String(week).padStart(2, "0")}`;
  }

  function updateChoice() {
    if (!choice || !weekField) return;
    const borrowing = choice.value === "borrow";
    weekField.hidden = !borrowing;
    weekField.querySelectorAll("input").forEach(input => { input.disabled = !borrowing; });
  }
  choice?.addEventListener("change", updateChoice);
  updateChoice();

  form.addEventListener("submit", async event => {
    if (!window.fetch) return; // Native form submission remains available.
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('[type="submit"]');
    const error = form.querySelector("[data-form-error]");
    const success = document.getElementById(form.dataset.successTarget);
    const originalLabel = submit.textContent;
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {Accept: "application/json"}
      });
      if (response.status === 429) throw new Error("rate-limit");
      if (!response.ok) throw new Error(`Submission returned ${response.status}`);
      const eventName = form.dataset.asyncForm === "feedback"
        ? "feedback_submitted"
        : choice?.value === "notify" ? "update_request_submitted" : "borrow_request_submitted";
      EscapeAnalytics.track(eventName, {game: "hiking"});
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (failure) {
      error.textContent = failure.message === "rate-limit"
        ? "Too many requests right now. Please wait a minute and try again."
        : "We couldn't send this yet. Please try again.";
      error.hidden = false;
      error.focus();
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
});
