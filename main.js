// main.js — small shared behaviors used across every page

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    const original = copyBtn.textContent;
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch (e) {
        // Clipboard API unavailable — fall back silently, email is still
        // visible as plain text for the person to copy manually.
      }
      copyBtn.dataset.copied = "true";
      copyBtn.textContent = "Copied — " + email;
      setTimeout(() => {
        copyBtn.dataset.copied = "false";
        copyBtn.textContent = original;
      }, 2000);
    });
  }
});
