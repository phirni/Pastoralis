// intro.js – split‑flap billboard, sized around the quote (not the
// viewport), floating with margin over the painting, gap between tiles
// so the artwork is always visible, no fixed breakpoints — recomputes
// cleanly on resize.

(function () {
  const introEl = document.getElementById("intro");
  const gridEl = document.getElementById("flip-grid");
  const captionEl = document.getElementById("intro-caption");
  const skipBtn = document.getElementById("intro-skip");
  const mainEl = document.getElementById("site-main");

  if (!introEl || !gridEl) return;

  // ---- 1. Choose quote ----
  const quote = typeof getTodaysQuote === "function"
    ? getTodaysQuote()
    : { text: "The years teach much which the days never know.", source: "Emerson" };

  // ---- 2. Choose a random background image ----
  const IMAGES = [

    "painting1.jpg",
    "painting4.jpg",
    "painting3.jpg",
    "painting5.jpg",
  ];
  const imageName = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  const imagePath = `assets/${imageName}`;

  const GAP = 2;        // px between tiles — lets the painting bleed through
  const MARGIN = 0.90;  // board uses at most 90% of the viewport, so it
                         // floats over the painting instead of filling it
  const H_PAD = 3;       // empty columns of breathing room either side of quote
  const V_PAD = 2;       // empty rows of breathing room above/below quote

  function wrapQuote(text, maxCols) {
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
      if (addLen > maxCols) {
        lines.push(cur);
        cur = [w];
        curLen = w.length;
      } else {
        curLen = addLen;
        cur.push(w);
      }
    });
    if (cur.length) lines.push(cur);

    return lines.map(words => words.join(" "));
  }

  // ---- 3. Compute board size from the quote, not the viewport ----
  function computeLayout() {
    const availW = window.innerWidth * MARGIN;
    const availH = window.innerHeight * MARGIN;

    const guessTile = Math.max(24, Math.min(70, Math.floor(window.innerWidth / 22)));
    const wrapCols = Math.max(6, Math.floor(availW / guessTile) - H_PAD * 2);

    const lines = wrapQuote(quote.text, wrapCols);
    const longest = Math.max(...lines.map(l => l.length));

    const COLS = longest + H_PAD * 2;
    const ROWS = lines.length + V_PAD * 2;

    const tileFromW = (availW - (COLS - 1) * GAP) / COLS;
    const tileFromH = (availH - (ROWS - 1) * GAP) / ROWS;
    const TILE = Math.max(10, Math.floor(Math.min(tileFromW, tileFromH)));

    return { lines, COLS, ROWS, TILE };
  }

  // ---- 4. Place the quote block within the (already padded) grid ----
  // Spaces are skipped so they remain transparent gaps.
  function layoutQuote(lines, cols, rows) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    const longest = Math.max(...lines.map(l => l.length));
    const extraRows = Math.max(0, rows - lines.length);
    const extraCols = Math.max(0, cols - longest);

    const topPad = Math.floor(Math.random() * (extraRows + 1));
    const startCol = Math.floor(Math.random() * (extraCols + 1));

    lines.forEach((line, idx) => {
      const rowIndex = Math.min(topPad + idx, rows - 1);
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === ' ') continue; // 👈 skip spaces – cell stays null
        const col = startCol + i;
        if (col < cols) grid[rowIndex][col] = ch;
      }
    });

    return grid;
  }

  // ---- 5. Render only what's needed: letter cells get tiles, empty
  // cells stay borderless/backgroundless so the painting shows through
  // completely uninterrupted, not just tinted. ----
  function renderGrid(grid, cols, rows, tile) {
    gridEl.innerHTML = "";
    gridEl.style.gap = `${GAP}px`;
    gridEl.style.width = `${cols * tile + (cols - 1) * GAP}px`;
    gridEl.style.height = `${rows * tile + (rows - 1) * GAP}px`;
    gridEl.style.gridTemplateColumns = `repeat(${cols}, ${tile}px)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, ${tile}px)`;

    grid.forEach(row => {
      for (let c = 0; c < cols; c++) {
        const ch = row ? row[c] : null;
        const cell = document.createElement("div");
        // Extra safety: treat only non‑null, non‑space characters as letters
        if (ch && ch !== ' ') {
          cell.className = "cell letter";
          const glyph = document.createElement("span");
          glyph.className = "glyph";
          glyph.dataset.target = ch;
          glyph.textContent = "";
          cell.appendChild(glyph);
        } else {
          cell.className = "cell blank";
        }
        gridEl.appendChild(cell);
      }
    });
  }

  // ---- 6. Flap animation ----
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const STEPS = 5;
  const STEP_MS = 70;
  const STAGGER_MS = 28;

  function animateGrid() {
    const glyphs = Array.from(gridEl.querySelectorAll(".glyph"));
    if (glyphs.length === 0) return;

    glyphs.forEach((glyph, idx) => {
      const target = glyph.dataset.target;
      const delay = idx * STAGGER_MS;
      let step = 0;

      setTimeout(function start() {
        runStep();
      }, delay);

      function runStep() {
        if (step < STEPS) {
          glyph.textContent = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        } else {
          glyph.textContent = target;
        }
        glyph.classList.remove("flipping");
        void glyph.offsetWidth;
        glyph.classList.add("flipping");

        step++;
        if (step <= STEPS) {
          setTimeout(runStep, STEP_MS);
        }
      }
    });
  }

  // ---- 7. Build (or rebuild) the board ----
  function build(animate) {
    const { lines, COLS, ROWS, TILE } = computeLayout();
    const grid = layoutQuote(lines, COLS, ROWS);
    renderGrid(grid, COLS, ROWS, TILE);
    captionEl.textContent = `“${quote.text}” — ${quote.source}`;
    if (animate) {
      requestAnimationFrame(() => animateGrid());
    }
  }

  // ---- 8. Preload image, then build ----
  function init() {
    const img = new Image();
    console.log(`Loading background: ${imagePath}`); // 👈 log the path

    img.onload = function () {
      console.log('Image loaded successfully');      // 👈 confirm success
      introEl.style.backgroundImage = `url(${imagePath})`;
      introEl.style.backgroundSize = "cover";
      introEl.style.backgroundPosition = "center";
      build(true);
    };

    img.onerror = function () {
      console.error('Image failed to load – check path and file existence');
      introEl.style.background = "#222";
      build(true);
    };

    img.src = imagePath;
  }

  // ---- 9. Recompute on resize (debounced), no animation replay ----
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => build(false), 150);
  });

  // ---- 10. Dismiss handlers ----
  function finish() {
    introEl.classList.add("hidden");
    if (mainEl) mainEl.style.display = "";
    document.documentElement.classList.add("site-revealed");
  }

  skipBtn.addEventListener("click", finish);
  introEl.addEventListener("click", (e) => {
    if (e.target === skipBtn) return;
    finish();
  });

  // ---- 11. Start ----
  init();
})();