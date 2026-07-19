// quotes.js
// Add, remove, or edit quotes here — one is chosen per calendar day (same
// quote for everyone on a given date, based on day-of-year), so the list
// repeats on a yearly cycle. No build step needed, just edit this array.

const QUOTES = [
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", source: "Emerson" },
  { text: "The years teach much which the days never know.", source: "Emerson, Experience" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", source: "Emerson" },
  { text: "Nothing great was ever achieved without enthusiasm.", source: "Emerson" },
  { text: "The only person you are destined to become is the person you decide to be.", source: "Emerson" },
  { text: "To be great is to be misunderstood.", source: "Emerson, Self-Reliance" },
  { text: "A man is a god in ruins.", source: "Emerson, Nature" },
  { text: "Do I contradict myself? Very well then I contradict myself, I am large, I contain multitudes.", source: "Whitman, Song of Myself" },
  { text: "I exist as I am, that is enough.", source: "Whitman, Song of Myself" },
  { text: "I think I could turn and live with animals, they are so placid and self contained.", source: "Whitman, Song of Myself" },
  { text: "Not I, nor anyone else can travel that road for you, you must travel it by yourself.", source: "Whitman" },
  { text: "Re-examine all you have been told, dismiss what insults your own soul.", source: "Whitman, Song of Myself" },
  { text: "I am large, I contain multitudes.", source: "Whitman, Song of Myself" },
  { text: "Failing to fetch me at first keep encouraged, missing me one place search another, I stop somewhere waiting for you.", source: "Whitman, Song of Myself" },
  { text: "You have the right to work, but never to the fruit of work.", source: "Bhagavad Gita, Ch. 2" },
  { text: "The soul is neither born, and nor does it die.", source: "Bhagavad Gita, Ch. 2" },
  { text: "Set thy heart upon thy work, but never on its reward.", source: "Bhagavad Gita, Ch. 2" },
  { text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.", source: "Bhagavad Gita, Ch. 6" },
  { text: "There is neither this world, nor the world beyond, nor happiness for the one who doubts.", source: "Bhagavad Gita, Ch. 4" },
  { text: "The mind acting through the senses may cause pleasure or pain, these come and go and are not permanent, therefore endure them.", source: "Bhagavad Gita, Ch. 2" }
];

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getTodaysQuote() {
  return QUOTES[
    Math.floor(Math.random() * QUOTES.length)
  ];
}