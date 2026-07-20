// intro.js
// Builds a split-flap billboard grid for today's quote, flips it in on load,
// then reveals the plain site. Plays once per browser session (sessionStorage),
// so re-opening the tab or navigating internally won't replay it, but a fresh
// session (new tab tomorrow, or after closing the browser) will.

(function () {
  const SEEN_KEY = "pastoralis_intro_seen";
  const introEl = document.getElementById("intro");
  const gridEl = document.getElementById("flip-grid");
  const captionEl = document.getElementById("intro-caption");
  const skipBtn = document.getElementById("intro-skip");
  const mainEl = document.getElementById("site-main");

  if (!introEl || !gridEl) return;

  const alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";

  if (alreadySeen) {
    introEl.classList.add("no-anim");
    revealSite(true);
    return;
  }

  const quote = typeof getTodaysQuote === "function"
    ? getTodaysQuote()
    : { text: "The years teach much which the days never know.", source: "Emerson" };

  // ============================================================
  // DYNAMIC GRID SIZING – fills the screen based on viewport
  // ============================================================
  const CELL_SIZE = 110;
  const cols = Math.ceil(window.innerWidth / CELL_SIZE);
  const totalRows = Math.ceil(window.innerHeight / CELL_SIZE);
  // ============================================================

  const seed = seedFromDate(new Date());
  const rng = mulberry32(seed);

  const rows = buildRows(quote.text, cols, totalRows, rng);
  renderGrid(rows, cols);
  captionEl.textContent = `“${quote.text}” — ${quote.source}`;

  // Kick off the flip animation, then auto-advance after a short pause.
  requestAnimationFrame(() => {
    animateGrid(rows, cols, () => {
      setTimeout(() => finish(), 900);
    });
  });

  skipBtn.addEventListener("click", finish);
  introEl.addEventListener("click", (e) => {
    if (e.target === skipBtn) return;
    finish();
  });

  function finish() {
    sessionStorage.setItem(SEEN_KEY, "1");
    introEl.classList.add("hidden");
    revealSite(false);
    setTimeout(() => introEl.classList.add("no-anim"), 650);
  }

  function revealSite(immediate) {
    if (mainEl) {
      mainEl.style.display = "";
    }
    document.documentElement.classList.add("site-revealed");
  }

  // ---------- grid construction ----------

  function buildRows(text, cols, totalRows, rng) {
    const words = text
      .toUpperCase()
      .replace(/[.,!?;:"“”]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const lines = [];
    let cur = [];
    let curLen = 0;
    words.forEach((w) => {
      const addLen = cur.length ? curLen + 1 + w.length : w.length;
      if (addLen > cols) {
        lines.push(cur);
        cur = [w];
        curLen = w.length;
      } else {
        curLen = addLen;
        cur.push(w);
      }
    });
    if (cur.length) lines.push(cur);

    // Build the actual content rows (with padding rows for spacing)
    const contentRows = [];
    contentRows.push(null); // top padding row
    for (let i = 0; i < lines.length; i++) {
      contentRows.push(lineToRow(lines[i], cols, rng));
      const isGroupEnd = (i + 1) % 2 === 0;
      if (isGroupEnd && i !== lines.length - 1) contentRows.push(null);
    }
    contentRows.push(null); // bottom padding row

    // Centre the content vertically within the total available rows
    const topPad = Math.floor((totalRows - contentRows.length) / 2);
    const bottomPad = totalRows - contentRows.length - topPad;

    const finalRows = [];
    for (let i = 0; i < topPad; i++) finalRows.push(null);
    finalRows.push(...contentRows);
    for (let i = 0; i < bottomPad; i++) finalRows.push(null);

    return finalRows;
  }

  function lineToRow(words, cols, rng) {
    const lineLen = words.join(" ").length;
    const maxStart = Math.max(0, cols - lineLen);
    const start = Math.floor(rng() * (maxStart + 1));
    const row = new Array(cols).fill(null);
    let col = start;
    words.forEach((w, wi) => {
      for (let i = 0; i < w.length; i++) {
        row[col] = w[i];
        col++;
      }
      col++; // space between words
    });
    return row;
  }

  // ---------- rendering ----------

  function renderGrid(rows, cols) {
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${rows.length}, 1fr)`;

    rows.forEach((row) => {
      for (let c = 0; c < cols; c++) {
        const ch = row ? row[c] : null;
        const cell = document.createElement("div");
        if (ch) {
          cell.className = "cell letter";
          const glyph = document.createElement("span");
          glyph.className = "glyph";
          glyph.textContent = "";
          glyph.dataset.target = ch;
          cell.appendChild(glyph);
        } else {
          cell.className = "cell blank";
        }
        gridEl.appendChild(cell);
      }
    });
  }

  function animateGrid(rows, cols, onDone) {
    const glyphs = Array.from(gridEl.querySelectorAll(".glyph"));
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const STEPS = 5;
    const STEP_MS = 55;
    const STAGGER_MS = 18;

    let finishedCount = 0;

    glyphs.forEach((glyph, idx) => {
      const target = glyph.dataset.target;
      const delay = idx * STAGGER_MS;
      let step = 0;

      setTimeout(function start() {
        runStep();
      }, delay);

      function runStep() {
        if (step < STEPS) {
          glyph.textContent = ALPHABET[Math.floor(rng() * ALPHABET.length)];
        } else {
          glyph.textContent = target;
        }
        glyph.classList.remove("flipping");
        void glyph.offsetWidth; // force reflow to restart animation
        glyph.classList.add("flipping");

        step++;
        if (step <= STEPS) {
          setTimeout(runStep, STEP_MS);
        } else {
          finishedCount++;
          if (finishedCount === glyphs.length) onDone();
        }
      }
    });

    if (glyphs.length === 0) onDone();
  }

  // ---------- seeded RNG (mulberry32) ----------

  function seedFromDate(date) {
    const s = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
})();