// quotes.js
// Add, remove, or edit quotes here — one is chosen per calendar day (same
// quote for everyone on a given date, based on day-of-year), so the list
// repeats on a yearly cycle. No build step needed, just edit this array.

const QUOTES = [
{ text: "Trust thyself: every heart vibrates to that iron string.", source: "Emerson" },
{ text: "Nothing can bring you peace but yourself.", source: "Emerson" },
{ text: "Insist on yourself; never imitate.", source: "Emerson" },
{ text: "Our chief want in life is somebody who shall make us do what we can.", source: "Emerson" },
{ text: "Character is higher than intellect.", source: "Emerson" },
{ text: "The only gift is a portion of thyself.", source: "Emerson" },

{ text: "I exist as I am, that is enough.", source: "Whitman" },
{ text: "Not I, nor anyone else can travel that road for you.", source: "Whitman" },
{ text: "Re-examine all you have been told.", source: "Whitman" },



{ text: "You have a right to action, but never to its fruits.", source: "Bhagavad Gita" },
{ text: "Let a man lift himself by himself.", source: "Bhagavad Gita" },
{ text: "The self is the friend of the self.", source: "Bhagavad Gita" },

{ text: "Perform your duty, abandoning attachment.", source: "Bhagavad Gita" },

{ text: "Waste no more time arguing what a good man should be. Be one.", source: "Marcus Aurelius" },
{ text: "Dig within. Within is the fountain of good.", source: "Marcus Aurelius" },
{ text: "The impediment to action advances action.", source: "Marcus Aurelius" },
{ text: "If it is not right, do not do it.", source: "Marcus Aurelius" },
{ text: "The soul becomes dyed with the color of its thoughts.", source: "Marcus Aurelius" },
{ text: "Look well into thyself.", source: "Marcus Aurelius" },

{ text: "We suffer more often in imagination than in reality.", source: "Seneca" },
{ text: "No man was ever wise by chance.", source: "Seneca" },
{ text: "While we wait for life, life passes.", source: "Seneca" },
{ text: "Difficulties strengthen the mind.", source: "Seneca" },
{ text: "Begin at once to live.", source: "Seneca" },

{ text: "The greatest thing in the world is to know how to belong to oneself.", source: "Montaigne" },
{ text: "He who fears he shall suffer already suffers.", source: "Montaigne" },
{ text: "I study myself more than any other subject.", source: "Montaigne" },
{ text: "Every man bears the whole stamp of the human condition.", source: "Montaigne" },

{ text: "Purity of heart is to will one thing.", source: "Kierkegaard" },
{ text: "Life can only be understood backwards; but it must be lived forwards.", source: "Kierkegaard" },
{ text: "The most common form of despair is not being who you are.", source: "Kierkegaard" },
{ text: "To dare is to lose one's footing momentarily.", source: "Kierkegaard" },

{ text: "There is a time for many words, and there is also a time for sleep.", source: "Homer" },
{ text: "The blade itself incites to deeds of violence.", source: "Homer" },
{ text: "There is strength in the union of many.", source: "Homer" },
{ text: "Endure, my heart.", source: "Homer" },

{ text: "I know not all that may be coming, but be it what it will, I'll go to it laughing.", source: "Moby-Dick" },
{ text: "It is not down on any map; true places never are.", source: "Moby-Dick" },

{ text: "The heart has its reasons of which reason knows nothing.", source: "Pascal" },
{ text: "Little things console us because little things afflict us.", source: "Pascal" },
{ text: "How we spend our days is, of course, how we spend our lives.", source: "Annie Dillard" },
{ text: "To be nobody-but-yourself — in a world which is doing its best, night and day, to make you everybody else — means to fight the hardest battle which any human being can fight; and never stop fighting.", source: "E.E. Cummings" },
{ text: "The kinder and the more thoughtful a person is, the more kindness he can find in other people. Kindness enriches our life; with kindness mysterious things become clear, difficult things become easy, and dull things become cheerful.", source: "Leo Tolstoy" },
{ text: "One discovers the light in darkness, that is what darkness is for; but everything in our lives depends on how we bear the light.", source: "James Baldwin" }

];

// Add these to your QUOTES array

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
