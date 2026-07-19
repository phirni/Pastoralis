// intro.js
// Split-flap intro with random word placement, word-by-word animation,
// fullscreen square tiles, and preloaded background images.

(function () {

  // ============================================================
  // CONFIGURATION
  // ============================================================
  const CELL_SIZE = 96;

  const IMAGES = [
    "cowboy.jpg",
    "cowboy2.jpg",
    "painting1.jpg",
    "painting2.jpg",
    "painting3.jpg",
    "painting4.jpg",
    "painting5.jpg",
    "painting6.jpg",
    "painting7.jpg",
    "painting8.jpg"
  ];
  // ============================================================

  const introEl = document.getElementById("intro");
  const gridEl = document.getElementById("flip-grid");
  const captionEl = document.getElementById("intro-caption");
  const skipBtn = document.getElementById("intro-skip");
  const mainEl = document.getElementById("site-main");

  if (!introEl || !gridEl) return;

  // ----- sessionStorage check (commented out – plays every time) -----
  // const SEEN_KEY = "pastoralis_intro_seen";
  // const alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
  // if (alreadySeen) {
  //   introEl.classList.add("no-anim");
  //   revealSite(true);
  //   return;
  // }
  // ------------------------------------------------------------------

  // ----- pick quote -----
  const quote = typeof getTodaysQuote === "function"
    ? getTodaysQuote()
    : { text: "The years teach much which the days never know.", source: "Emerson" };

  // ----- pick random image -----
  const imageName = IMAGES[Math.floor(Math.random() * IMAGES.length)];

  // ----- calculate grid dimensions -----
  const cols = Math.ceil(window.innerWidth / CELL_SIZE);
  const rows = Math.ceil(window.innerHeight / CELL_SIZE);

  // ----- seeded RNG (using current timestamp for freshness) -----
  const rng = mulberry32(Date.now());

  let canExit = false;

  // ----- set caption immediately -----
  captionEl.textContent = `“${quote.text}” — ${quote.source}`;

  // ----- preload background image, then initialise board -----
  preloadBackground(imageName)
    .then(() => {
      initializeBoard();
    });

  // ============================================================
  // PRELOAD & INITIALISE
  // ============================================================

  function preloadBackground(image) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        gridEl.style.backgroundImage = `url(assets/${image})`;
        resolve();
      };
      img.onerror = resolve;
      img.src = `assets/${image}`;
    });
  }

  function initializeBoard() {
    const board = buildBoard(quote.text);
    renderGrid(board, cols);

    requestAnimationFrame(() => {
      animateGrid(board, cols, () => {
        canExit = true;
        introEl.classList.add("ready");
      });
    });
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================

  skipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!canExit) return;
    finish();
  });

  introEl.addEventListener("click", (e) => {
    if (!canExit) return;
    if (e.target === skipBtn) return;
    finish();
  });

  // ============================================================
  // FINISH & REVEAL
  // ============================================================

  function finish() {
    // sessionStorage.setItem(SEEN_KEY, "1");
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

  // ============================================================
  // RANDOM BOARD BUILDER (Part 3)
  // ============================================================

  function buildBoard(text) {
    const board = [];
    for (let r = 0; r < rows; r++) {
      board.push(new Array(cols).fill(null));
    }

    const words = text
      .toUpperCase()
      .replace(/[.,!?;:"“”]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const usedRows = [];

    words.forEach(word => {
      let placed = false;
      for (let tries = 0; tries < 100 && !placed; tries++) {
        const row = Math.floor(Math.random() * rows);
        if (usedRows.includes(row)) continue;
        const maxStart = cols - word.length - 2;
        if (maxStart < 1) continue;
        const start = 1 + Math.floor(Math.random() * maxStart);

        let free = true;
        for (let i = 0; i < word.length; i++) {
          if (board[row][start + i] != null) {
            free = false;
            break;
          }
        }
        if (!free) continue;

        usedRows.push(row);
        for (let i = 0; i < word.length; i++) {
          board[row][start + i] = word[i];
        }
        placed = true;
      }
    });

    return board;
  }

  // ============================================================
  // RENDER – fixed pixel sizes (Part 2)
  // ============================================================

  function renderGrid(board, cols) {
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;

    board.forEach(row => {
      row.forEach(letter => {
        const cell = document.createElement("div");
        if (letter) {
          cell.className = "cell letter";
          const glyph = document.createElement("span");
          glyph.className = "glyph";
          glyph.dataset.target = letter;
          glyph.textContent = "";
          cell.appendChild(glyph);
        } else {
          cell.className = "cell blank";
        }
        gridEl.appendChild(cell);
      });
    });
  }

  // ============================================================
  // WORD‑BY‑WORD ANIMATION (Part 3)
  // ============================================================

  function animateGrid(board, cols, onDone) {
    const cells = [...gridEl.querySelectorAll(".glyph")];
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const STEP_MS = 55;
    const LETTER_DELAY = 35;
    const WORD_DELAY = 180;

    // Group glyphs by row (word)
    let words = [];
    let current = [];
    cells.forEach(g => {
      const rect = g.parentElement.getBoundingClientRect();
      current.push({ glyph: g, x: rect.left, y: rect.top });
    });
    current.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 10) return a.x - b.x;
      return a.y - b.y;
    });
    words.push(current);

    let finished = 0;
    words.forEach((word, wordIndex) => {
      word.forEach((item, letterIndex) => {
        setTimeout(() => {
          flipLetter(item.glyph);
        }, wordIndex * WORD_DELAY + letterIndex * LETTER_DELAY);
      });
    });

    function flipLetter(glyph) {
      let step = 0;
      function next() {
        if (step < 5) {
          glyph.textContent = ALPHABET[Math.floor(Math.random() * 26)];
        } else {
          glyph.textContent = glyph.dataset.target;
        }
        glyph.classList.remove("flipping");
        void glyph.offsetWidth;
        glyph.classList.add("flipping");
        step++;
        if (step <= 5) {
          setTimeout(next, STEP_MS);
        } else {
          finished++;
          if (finished === cells.length) {
            onDone();
          }
        }
      }
      next();
    }
  }

  // ============================================================
  // SEEDED RNG (mulberry32)
  // ============================================================

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