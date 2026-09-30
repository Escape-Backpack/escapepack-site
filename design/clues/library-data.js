// Editable catalogue. Preserve technique IDs when changing titles.
// Imported examples are design notes, not verified implementation or playtest evidence.
window.CLUE_LIBRARY = {
  "categories": [
    {
      "id": "using",
      "label": "How to use this",
      "kind": "page"
    },
    {
      "id": "all",
      "label": "All"
    },
    {
      "id": "text",
      "label": "Text & ciphers",
      "lede": "Ways to hide something inside writing — and ways to make writing itself the puzzle. The cheapest category: almost everything here costs nothing but a print run, which is why it carries most of our games."
    },
    {
      "id": "symbol",
      "label": "Symbols & alphabets",
      "lede": "Substitution systems that already exist in the world. Their advantage over an invented cipher is that they look like decoration, signage or period detail rather than a code — and their key can ship as an in-world reference sheet."
    },
    {
      "id": "map",
      "label": "Maps & space",
      "lede": "Anything that uses a printed map, a plan or physical space. The richest category for a treasure-hunt feel, and the one that rewards looking closely at something players assume is just scenery."
    },
    {
      "id": "prop",
      "label": "Props & objects",
      "lede": "Physical objects that carry, transform or release information. More expensive than print, and worth it: the moments players remember are almost always the ones where something opened, balanced, aligned or clicked."
    },
    {
      "id": "material",
      "label": "Light, ink & materials",
      "lede": "Tricks of the physical medium — what paper, ink, light and layering can do that content alone cannot. Reliably the biggest \"how did they do that\" reaction per pound spent."
    },
    {
      "id": "logic",
      "label": "Numbers & logic",
      "lede": "Puzzles where the challenge is reasoning rather than finding or decoding. They need no props, run in parallel with physical work, and give a group with one analytical player something to do."
    },
    {
      "id": "combine",
      "label": "Combining clues",
      "lede": "Patterns for making several clues, or several props, add up to one answer. Not ways of hiding information but ways of composing it: how a puzzle gets its inputs, how one lock can require four separate objects, and how to run several solving steps between two locks without buying more hardware."
    },
    {
      "id": "structure",
      "label": "Structure & flow",
      "lede": "Not clue types but ways of arranging them: how puzzles chain, how a finale gathers earlier pieces, what kind of lock to put on the end, and how a game paces itself."
    },
    {
      "id": "sources",
      "label": "Sources",
      "kind": "page"
    }
  ],
  "techniques": [
    {
      "c": "text",
      "n": "Null cipher",
      "d": 3,
      "m": "Print only",
      "t": "steganography reading nth-word",
      "w": "The real message is every Nth word or letter of an otherwise innocent passage. Nothing looks encrypted, because nothing is — the carrier text is genuinely readable.",
      "x": "A postcard’s typed Fun Fact reads normally, but the first word of each sentence gives WEIGH · WHAT · SHE · TRADED. Players who only read for meaning miss it entirely.",
      "s": [
        "Null cipher",
        "https://en.wikipedia.org/wiki/Null_cipher"
      ],
      "id": "null-cipher"
    },
    {
      "c": "text",
      "n": "Acrostic",
      "d": 2,
      "m": "Print only",
      "t": "first letters lines poem",
      "w": "First letters of each line, sentence or paragraph spell the answer. The oldest trick in the book and still one of the best, because handwritten letters naturally break into lines.",
      "x": "A note says “Look to the beginnings.” Its four lines begin Meet, A, Pack and Start. Their initials spell MAPS. This is a generic four-letter example, not a confirmed Norse puzzle.",
      "s": [
        "Acrostic",
        "https://en.wikipedia.org/wiki/Acrostic"
      ],
      "id": "acrostic"
    },
    {
      "c": "text",
      "n": "Telestich (last letters)",
      "d": 3,
      "m": "Print only",
      "t": "acrostic variant ending letters",
      "w": "Same as an acrostic but reading the last letter of each line, or the last word of each paragraph. Harder, because line endings feel accidental rather than designed.",
      "x": "Used as the second-level trick on a card where the acrostic gives a decoy word and the telestich gives the real one.",
      "warn": "Needs justified or deliberately broken line lengths, which can look odd in handwriting. Test it in the final font.",
      "s": [
        "Acrostic",
        "https://en.wikipedia.org/wiki/Acrostic"
      ],
      "id": "telestich-last-letters"
    },
    {
      "c": "text",
      "n": "Book cipher (Ottendorf)",
      "d": 3,
      "m": "Print only, plus a text to index",
      "t": "page line word coordinates cross-reference lookup",
      "w": "Numbers refer to positions in another document: page–line–word, or card–line–letter. The strength is that it forces two objects together and looks like a reference, not a code.",
      "x": "A luggage tag reads 4·2·3 / 11·1·6 / 2·5·1. The numbers index postcards by card number, line and word, and the retrieved words form the instruction.",
      "s": [
        "Book cipher",
        "https://en.wikipedia.org/wiki/Book_cipher"
      ],
      "id": "book-cipher-ottendorf"
    },
    {
      "c": "text",
      "n": "Cardan grille",
      "d": 2,
      "m": "Print plus one cut mask",
      "t": "overlay mask stencil comb window physical",
      "w": "A mask with holes laid over a page exposes only the words that matter. The carrier text reads as an ordinary letter; the grille turns it into an instruction.",
      "x": "Our comb prop is a grille in disguise — its broken teeth expose one word per gap. Rotating or flipping it reads a different card, so one prop serves several puzzles.",
      "s": [
        "Cardan grille",
        "https://en.wikipedia.org/wiki/Cardan_grille"
      ],
      "id": "cardan-grille"
    },
    {
      "c": "text",
      "n": "Caesar shift",
      "d": 2,
      "m": "Print only",
      "t": "substitution rot shift alphabet classic",
      "w": "Every letter moves a fixed number of places along the alphabet. Supply an alphabet and a way to infer the shift; do not assume players already know the method.",
      "x": "A \"postal sorting code\" stamped on an envelope is the shift value, so the number sitting in plain sight on the prop is the key.",
      "warn": "Keep the transcription short. The interesting step can be finding the shift or connecting the key to the message.",
      "s": [
        "Caesar cipher",
        "https://en.wikipedia.org/wiki/Caesar_cipher"
      ],
      "id": "caesar-shift"
    },
    {
      "c": "text",
      "n": "Atbash",
      "d": 2,
      "m": "Print only",
      "t": "reverse alphabet mirror substitution",
      "w": "The alphabet reversed: A becomes Z, B becomes Y. Include a reversed alphabet or enough in-game information to infer the rule.",
      "x": "A \"mirror\" motif appears throughout a container — a mirror prop, a mirrored monogram — cueing the reversal without ever naming it.",
      "s": [
        "Atbash",
        "https://en.wikipedia.org/wiki/Atbash"
      ],
      "id": "atbash"
    },
    {
      "c": "text",
      "n": "Vigenère cipher",
      "d": 5,
      "m": "Print, plus a printed tableau",
      "t": "keyword polyalphabetic hard advanced",
      "w": "A keyword shifts each letter by a different amount. Genuinely strong, and genuinely slow to solve by hand.",
      "x": "Reserved for a bonus or a \"designer’s cut\" puzzle rather than the main path, with the tableau printed as a page of Liv’s notebook.",
      "warn": "Too slow for a main-path puzzle in a two-hour game. Ten minutes of mechanical transcription with no insight in the middle.",
      "s": [
        "Vigenère cipher",
        "https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher"
      ],
      "id": "vigenere-cipher"
    },
    {
      "c": "text",
      "n": "Bacon’s cipher",
      "d": 4,
      "m": "Careful typesetting",
      "t": "typography binary two fonts steganography bold italic",
      "w": "Each letter is encoded as five binary units, carried by any two distinguishable states — two typefaces, upright and italic, serif and sans. The message hides in how the text is set, not what it says.",
      "x": "A typed museum label mixes two very similar serif faces. Grouped in fives, the pattern spells a three-letter answer. The label reads as a printing inconsistency.",
      "warn": "Needs a clear cue that typography is the channel, or it is unfindable. Consider one obvious sample where the two faces are exaggerated.",
      "s": [
        "Bacon’s cipher",
        "https://en.wikipedia.org/wiki/Bacon%27s_cipher"
      ],
      "id": "bacon-s-cipher"
    },
    {
      "c": "text",
      "n": "Emphasis steganography",
      "d": 2,
      "m": "Print only",
      "t": "bold italic underline highlight pulled letters",
      "w": "Letters picked out by bolding, underlining, a different ink, or a pen stroke. The lightest version of Bacon’s cipher and far more findable.",
      "x": "In her handwriting, seven letters across a card are gone over twice, as if she pressed harder. In order they spell the answer.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "emphasis-steganography"
    },
    {
      "c": "text",
      "n": "Rail fence cipher",
      "d": 3,
      "m": "Print only",
      "t": "transposition zigzag anagram order",
      "w": "The message is written in a zigzag across several rows then read off row by row. The letters are all present, just reordered — so partial progress is visible, which players find encouraging.",
      "x": "A ribbon carries the scrambled letters. A diagram elsewhere shows the number of rows and the zigzag reading rule.",
      "s": [
        "Rail fence cipher",
        "https://en.wikipedia.org/wiki/Rail_fence_cipher"
      ],
      "id": "rail-fence-cipher"
    },
    {
      "c": "text",
      "n": "Columnar transposition",
      "d": 4,
      "m": "Print only",
      "t": "grid columns reorder keyword",
      "w": "Text is written into a grid row by row and read out column by column, with a keyword setting column order. Feels like a filing system, which suits archive and records themes.",
      "x": "An \"index card\" of jumbled letters, with the column order given by the alphabetical position of four place names already known from the postcards.",
      "s": [
        "Transposition cipher",
        "https://en.wikipedia.org/wiki/Transposition_cipher"
      ],
      "id": "columnar-transposition"
    },
    {
      "c": "text",
      "n": "Scytale",
      "d": 3,
      "m": "A rod or cylinder of the right diameter",
      "t": "wrap strip cylinder physical ancient rod",
      "w": "A strip of paper wrapped around a rod of the correct diameter aligns letters that are meaningless flat. The prop is the key — only the right cylinder works.",
      "x": "A leather strap wraps around the handle of a specific tool in the bag. Wrapped around anything else the letters do not line up.",
      "s": [
        "Scytale",
        "https://en.wikipedia.org/wiki/Scytale"
      ],
      "id": "scytale"
    },
    {
      "c": "text",
      "n": "Contradiction clue",
      "d": 2,
      "m": "Print only",
      "t": "argue with the caption fun fact number pointing",
      "w": "A second voice disagrees with a stated fact, pointing at a number without ever saying \"use this number.\" Works because it is characterful first and functional second.",
      "x": "Typed: \"Eight timber-and-sod structures.\" Handwritten beside it: \"I counted seven and an argument.\" The seven is the digit.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "contradiction-clue"
    },
    {
      "c": "text",
      "n": "Counting the text",
      "d": 3,
      "m": "Print only",
      "t": "word count letters occurrences tally hidden number",
      "w": "The payload is a count rather than anything written: how many times a word appears, how many commas, how many capitalised names.",
      "x": "\"Count how often she says the word home across the whole deck.\" The answer is a two-digit number that no single card contains.",
      "warn": "Miscounting is the most common failure mode. Keep counts under about fifteen and make the target word visually distinct.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "counting-the-text"
    },
    {
      "c": "text",
      "n": "Continuation across a seam",
      "d": 2,
      "m": "Print only, aligned artwork",
      "t": "butt cards together sentence runs across self-verifying",
      "w": "A sentence runs off the edge of one card and continues on the next, so the cards must be physically placed in the right order before anything reads. Self-verifying: it reads or it does not.",
      "x": "Four postcards, one from each trail, butted together complete a sentence ending in an instruction. Our first-built puzzle, because it teaches players to treat cards as components.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "continuation-across-a-seam"
    },
    {
      "c": "text",
      "n": "Fold to join",
      "d": 2,
      "m": "Print, and a card you can crease",
      "t": "crease origami halves sentence physical",
      "w": "A crease brings two distant parts of a page together, forming a word or sentence present in neither half.",
      "x": "Folding a card so the postmark meets the address line makes two half-words into one. Print a spare — creasing is destructive.",
      "s": [
        "Origami",
        "https://en.wikipedia.org/wiki/Origami"
      ],
      "id": "fold-to-join"
    },
    {
      "c": "text",
      "n": "Redaction",
      "d": 2,
      "m": "Print only",
      "t": "blacked out censored missing words",
      "w": "Blacked-out text where either the surviving words are the message, or the shape and length of the redactions is.",
      "x": "A \"declassified\" excavation report where the unredacted words read as an instruction, and the redaction blocks form a bar code of word lengths.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "redaction"
    },
    {
      "c": "text",
      "n": "Deliberate error trail",
      "d": 3,
      "m": "Print only",
      "t": "typos mistakes wrong letters spelling",
      "w": "Planted misspellings, wrong dates or wrong names across several documents. The incorrect characters, in order, spell the answer.",
      "x": "Across six postcards, one place name is misspelled on each. The wrong letters spell a word.",
      "warn": "Risks reading as sloppy production rather than design. Give one unmistakable error early so players know errors are intentional.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "deliberate-error-trail"
    },
    {
      "c": "text",
      "n": "Anagram",
      "d": 3,
      "m": "Print only",
      "t": "letters rearranged wordplay",
      "w": "Letters rearranged into the answer. Best when the anagram is itself meaningful in the story so it does not read as arbitrary.",
      "x": "The name of a fictional hotel anagrams to the answer word, and a card comments that she \"never could spell it the same way twice.\"",
      "s": [
        "Anagram",
        "https://en.wikipedia.org/wiki/Anagram"
      ],
      "id": "anagram"
    },
    {
      "c": "text",
      "n": "Ambigram / rotation",
      "d": 3,
      "m": "Careful lettering or a font",
      "t": "upside down rotate 180 reads differently",
      "w": "Text that reads as something else rotated or mirrored. A strong \"aha\" because the transformation is physical — players turn the object.",
      "x": "A number on a luggage tag reads 1972 one way and something else inverted, so which way up the tag hangs is the puzzle.",
      "s": [
        "Ambigram",
        "https://en.wikipedia.org/wiki/Ambigram"
      ],
      "id": "ambigram-rotation"
    },
    {
      "c": "text",
      "n": "Rebus",
      "d": 2,
      "m": "Print with small illustrations",
      "t": "pictures puns visual wordplay sounds like",
      "w": "Pictures and letters combined to sound out a word. Language-dependent and playful; good for lighter games and younger players.",
      "x": "A stamp motif of a bee beside the letters LOW gives BELOW, telling players where to look.",
      "s": [
        "Rebus",
        "https://en.wikipedia.org/wiki/Rebus"
      ],
      "id": "rebus"
    },
    {
      "c": "text",
      "n": "Mirror writing",
      "d": 1,
      "m": "Print, plus a mirror or reflective prop",
      "t": "reversed reflection leonardo",
      "w": "Text printed reversed, readable in a mirror or held to the light and viewed from behind. Instantly recognisable, so use it for a fast early win.",
      "x": "A note tucked behind a photograph reads backwards; the bag has a small signalling mirror among the props.",
      "s": [
        "Mirror writing",
        "https://en.wikipedia.org/wiki/Mirror_writing"
      ],
      "id": "mirror-writing"
    },
    {
      "c": "text",
      "n": "Palimpsest / layered document",
      "d": 3,
      "m": "Print with ghosted underlayer",
      "t": "erased overwritten underneath earlier text",
      "w": "An earlier text partly scraped away and written over. The ghost of the first version is the clue.",
      "x": "A \"reused\" page of her notebook has a faint earlier list showing through, in a different order from the visible one.",
      "s": [
        "Palimpsest",
        "https://en.wikipedia.org/wiki/Palimpsest"
      ],
      "id": "palimpsest-layered-document"
    },
    {
      "c": "text",
      "n": "Marginalia and annotation",
      "d": 2,
      "m": "Print only",
      "t": "notes in margins underlining reader marks",
      "w": "A printed document annotated by hand: underlines, ticks, question marks, a page corner turned down. What she marked is the message.",
      "x": "A museum pamphlet has three exhibit numbers circled and linked by numbered arrows. The arrows establish the reading order for the code.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "marginalia-and-annotation"
    },
    {
      "c": "text",
      "n": "Index or dictionary lookup",
      "d": 2,
      "m": "Print, plus a reference booklet",
      "t": "glossary alphabetical entry page reference",
      "w": "A word sends players to an index, glossary or catalogue that supplies a number or a further word. Reads as research, which suits archive themes.",
      "x": "A card names an object; the museum catalogue in the bag lists it with an accession number that is the code.",
      "s": [
        "Book cipher",
        "https://en.wikipedia.org/wiki/Book_cipher"
      ],
      "id": "index-or-dictionary-lookup"
    },
    {
      "c": "text",
      "n": "Read it aloud",
      "d": 3,
      "m": "Print only",
      "t": "phonetic spoken pun homophone say it",
      "w": "Nonsense on the page that resolves when spoken — a phonetic rendering, a homophone chain, a foreign phrase heard rather than read.",
      "x": "A string of Old Norse-looking syllables read aloud sounds like an English instruction. Rewards the group that reads to each other, which is the behaviour we want anyway.",
      "warn": "Accent-dependent. Test with someone who did not write it.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "read-it-aloud"
    },
    {
      "c": "text",
      "n": "Calligram / shaped text",
      "d": 2,
      "m": "Print only",
      "t": "text forms a shape arrow outline typography",
      "w": "The text is set in the shape of something — an arrow, a coastline, an object — so the layout carries information the words do not.",
      "x": "A dense paragraph on a map back is set in the outline of a fjord that appears on exactly one of the four maps.",
      "s": [
        "Calligram",
        "https://en.wikipedia.org/wiki/Calligram"
      ],
      "id": "calligram-shaped-text"
    },
    {
      "c": "text",
      "n": "Cross-document assembly",
      "d": 3,
      "m": "Print only",
      "t": "combine several sources one answer each triangulate",
      "w": "No single document holds the answer; each supplies one attribute, and only one candidate satisfies all of them.",
      "x": "A birth year from a letter, a departure year from a passenger list and a brooch motif from a photo caption identify one ancestor out of four. Her archive number is the code.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "cross-document-assembly"
    },
    {
      "c": "text",
      "n": "Instruction disguised as voice",
      "d": 2,
      "m": "Print only",
      "t": "rule card task setting narrative in character",
      "w": "The rule for a puzzle is written as characterful chat rather than as an instruction. The card tells players what to do without ever sounding like a manual.",
      "x": "\"The game we used to play — I have set it up as I left it. King to a corner in three. You never could see the second move.\" That is a complete ruleset and it reads as an aunt teasing a nephew.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "instruction-disguised-as-voice"
    },
    {
      "c": "symbol",
      "n": "Morse code",
      "d": 2,
      "m": "Print, or a light/sound source",
      "t": "dots dashes signal flashing beeps",
      "w": "Dots and dashes, hideable as any two-state pattern: long and short stitches, beads, fence posts, a flashing lamp, dashes in a decorative border.",
      "x": "The decorative rule under a postcard’s Fun Fact is not a rule — it is dashes and dots at two lengths, spelling a three-letter word.",
      "warn": "Supply the key. Assuming players know Morse breaks the clue-everything rule; a printed key on a prop fixes it.",
      "s": [
        "Morse code",
        "https://en.wikipedia.org/wiki/Morse_code"
      ],
      "id": "morse-code"
    },
    {
      "c": "symbol",
      "n": "Flag semaphore",
      "d": 3,
      "m": "Print with figure illustrations",
      "t": "arms positions flags signalling figures",
      "w": "Letters as arm or flag positions. Hides beautifully in illustrations of people, weather vanes, clock hands or signposts.",
      "x": "Six figures in a stamp illustration hold their tools at odd angles. Read as semaphore they spell the answer.",
      "s": [
        "Flag semaphore",
        "https://en.wikipedia.org/wiki/Flag_semaphore"
      ],
      "id": "flag-semaphore"
    },
    {
      "c": "symbol",
      "n": "Maritime signal flags",
      "d": 2,
      "m": "Print in colour",
      "t": "nautical bunting ships flags colour",
      "w": "Each flag is a letter and also has a standalone meaning at sea. Decorative bunting in an illustration can spell a word while looking purely festive.",
      "x": "Bunting strung across a harbour scene on a postcard front spells a four-letter place name.",
      "s": [
        "International maritime signal flags",
        "https://en.wikipedia.org/wiki/International_maritime_signal_flags"
      ],
      "id": "maritime-signal-flags"
    },
    {
      "c": "symbol",
      "n": "Braille",
      "d": 2,
      "m": "Print, or embossed card",
      "t": "dots tactile raised six-dot",
      "w": "Six-dot cells. Printed flat it reads as a dot pattern; embossed it becomes a tactile puzzle that can be solved in the dark or inside a closed box.",
      "x": "The pinholes in a \"moth-eaten\" map corner are a Braille word when the sheet is held to the light.",
      "s": [
        "Braille",
        "https://en.wikipedia.org/wiki/Braille"
      ],
      "id": "braille"
    },
    {
      "c": "symbol",
      "n": "Pigpen cipher",
      "d": 2,
      "m": "Print, plus a key",
      "t": "masonic grid symbols boxes dots",
      "w": "Letters as grid fragments. Looks like a decorative or occult alphabet, so it passes as period ornament — and its key is easy to hide as a doodle.",
      "x": "Symbols tooled into a leather strap, with the key drawn inside the cover of her notebook as an idle sketch.",
      "s": [
        "Pigpen cipher",
        "https://en.wikipedia.org/wiki/Pigpen_cipher"
      ],
      "id": "pigpen-cipher"
    },
    {
      "c": "symbol",
      "n": "Polybius square",
      "d": 3,
      "m": "Print, plus a 5×5 grid",
      "t": "coordinates pairs numbers grid five by five",
      "w": "Letters become number pairs on a 5×5 grid. Useful because it converts words into digits, which is exactly what a numeric padlock needs.",
      "x": "A word extracted from an earlier puzzle is converted to digit pairs using a grid printed as a \"sorting table,\" yielding the four-digit code.",
      "s": [
        "Polybius square",
        "https://en.wikipedia.org/wiki/Polybius_square"
      ],
      "id": "polybius-square"
    },
    {
      "c": "symbol",
      "n": "Tap code",
      "d": 3,
      "m": "Sound, or printed marks",
      "t": "knocks taps prisoner rhythm grid",
      "w": "The Polybius square delivered as knocks. Works as an audio clue, or printed as clusters of scratches or notches.",
      "x": "Notches on the edge of a wooden prop, grouped in pairs, decode through the same grid as the written puzzle beside it.",
      "s": [
        "Tap code",
        "https://en.wikipedia.org/wiki/Tap_code"
      ],
      "id": "tap-code"
    },
    {
      "c": "symbol",
      "n": "Runes (Younger Futhark)",
      "d": 2,
      "m": "Print, plus a key",
      "t": "norse viking futhark alphabet historical",
      "w": "A real historical alphabet with a strong visual identity. Perfect thematically for the Norse bag, but it must ship with a key and should not be presented as a one-to-one match for English.",
      "x": "Her own invented museum-label code: three runes with a supplied key give a three-digit number.",
      "warn": "Call it the aunt’s invented cipher. A modern English substitution presented as authentic Norse writing is a history error we have already flagged.",
      "s": [
        "Younger Futhark",
        "https://en.wikipedia.org/wiki/Younger_Futhark"
      ],
      "id": "runes-younger-futhark"
    },
    {
      "c": "symbol",
      "n": "Bind runes",
      "d": 4,
      "m": "Print with custom artwork",
      "t": "combined runes overlapping monogram ligature",
      "w": "Two or more runes drawn sharing a single stave, so one mark contains several letters. Reads as a monogram or maker’s mark until players realise it decomposes.",
      "x": "A \"family sigil\" repeated throughout the bag turns out to be three overlaid runes, giving the initials that order three containers.",
      "s": [
        "Bind rune",
        "https://en.wikipedia.org/wiki/Bind_rune"
      ],
      "id": "bind-runes"
    },
    {
      "c": "symbol",
      "n": "Branch / twig runes",
      "d": 4,
      "m": "Print, plus a key",
      "t": "cipher runes tally group position coordinates",
      "w": "A historical cipher where the number of strokes on each side of a stave gives a group-and-position coordinate. Genuinely period, genuinely a coordinate system.",
      "x": "Five carved staves on a rune stick decode to five letters via strokes left and right. Already worked into the Norse bag.",
      "s": [
        "Runic magic and cipher runes",
        "https://en.wikipedia.org/wiki/Runes"
      ],
      "id": "branch-twig-runes"
    },
    {
      "c": "symbol",
      "n": "Ogham",
      "d": 3,
      "m": "Print, plus a key",
      "t": "celtic notches line edge strokes",
      "w": "Strokes across or beside a central line — designed for carving on an edge, which means it can be hidden along the border of anything.",
      "x": "The decorative edging on a map border is Ogham, giving a word that means nothing until a later puzzle asks for it.",
      "s": [
        "Ogham",
        "https://en.wikipedia.org/wiki/Ogham"
      ],
      "id": "ogham"
    },
    {
      "c": "symbol",
      "n": "Pictorial substitution (dancing men)",
      "d": 3,
      "m": "Custom artwork, plus a key",
      "t": "figures drawings letters sherlock holmes",
      "w": "A bespoke alphabet drawn as little figures or objects. The point is that it reads as a child’s drawing or a decorative frieze rather than writing.",
      "x": "A row of dancing figures along the top of a map, with the key derivable from one word players already know — the name on the bag.",
      "s": [
        "The Adventure of the Dancing Men",
        "https://en.wikipedia.org/wiki/The_Adventure_of_the_Dancing_Men"
      ],
      "id": "pictorial-substitution-dancing-men"
    },
    {
      "c": "symbol",
      "n": "Musical cryptogram",
      "d": 4,
      "m": "Printed stave, optional instrument",
      "t": "notes A-G melody music sheet",
      "w": "Notes A to G spell words directly. A written melody can carry a hidden word, and playing it aloud is a second, theatrical way to solve.",
      "x": "A folk tune copied into her notebook uses only seven notes; read as letters they spell the word lock answer.",
      "s": [
        "Musical cryptogram",
        "https://en.wikipedia.org/wiki/Musical_cryptogram"
      ],
      "id": "musical-cryptogram"
    },
    {
      "c": "symbol",
      "n": "Chess notation",
      "d": 3,
      "m": "A board, or a printed diagram",
      "t": "algebraic squares moves game board coordinates",
      "w": "Squares are already coordinates, and a recorded game is already a sequence. A board on the table converts letters and numbers into physical positions.",
      "x": "A hnefatafl-style board where the king’s three-move escape gives leg lengths 2, 3 and 1 — the code 231, never printed anywhere.",
      "s": [
        "Algebraic notation (chess)",
        "https://en.wikipedia.org/wiki/Algebraic_notation_(chess)"
      ],
      "id": "chess-notation"
    },
    {
      "c": "symbol",
      "n": "Seven-segment digits",
      "d": 3,
      "m": "Print only",
      "t": "calculator display segments broken digits lcd",
      "w": "Digits built from seven bars. Removing bars turns one digit into another, and a \"broken display\" becomes a puzzle about which segments are missing.",
      "x": "A damaged luggage label shows partial digits; only one four-digit number is consistent with every surviving segment.",
      "s": [
        "Seven-segment display",
        "https://en.wikipedia.org/wiki/Seven-segment_display"
      ],
      "id": "seven-segment-digits"
    },
    {
      "c": "symbol",
      "n": "Roman numerals",
      "d": 1,
      "m": "Print only",
      "t": "numerals dates monuments inscriptions",
      "w": "Hides in plain sight on buildings, clock faces, book chapters and monument inscriptions. Cheapest way to put a number somewhere nobody reads it as a number.",
      "x": "A church façade in a postcard illustration carries a dedication date; the numerals are the digits.",
      "s": [
        "Roman numerals",
        "https://en.wikipedia.org/wiki/Roman_numerals"
      ],
      "id": "roman-numerals"
    },
    {
      "c": "symbol",
      "n": "Tally marks",
      "d": 1,
      "m": "Print only",
      "t": "counting scratches groups of five",
      "w": "Scratched groups of five. Reads as a record of something mundane — days at sea, drinks owed — while carrying a number.",
      "x": "Scratches on the inside of a tin, grouped, give the number of stops on one trail.",
      "s": [
        "Tally marks",
        "https://en.wikipedia.org/wiki/Tally_marks"
      ],
      "id": "tally-marks"
    },
    {
      "c": "symbol",
      "n": "Clock positions",
      "d": 2,
      "m": "Print, or a clock prop",
      "t": "hands time angles direction o-clock",
      "w": "Hand positions give numbers, directions or letters. A stopped clock in a photograph is a number nobody questions.",
      "x": "Four photographs each show a station clock. The four times, read as digits, give the code — and the order comes from the postmarks.",
      "s": [
        "Clock position",
        "https://en.wikipedia.org/wiki/Clock_position"
      ],
      "id": "clock-positions"
    },
    {
      "c": "symbol",
      "n": "Heraldry and blazon",
      "d": 3,
      "m": "Print in colour",
      "t": "coats of arms shields tinctures family crest",
      "w": "Coats of arms have a formal grammar, and family arms suit genealogy stories. Colours and charges can encode a sequence.",
      "x": "Four family shields, each with a different number of charges, order themselves by a rule stated in a letter.",
      "s": [
        "Heraldry",
        "https://en.wikipedia.org/wiki/Heraldry"
      ],
      "id": "heraldry-and-blazon"
    },
    {
      "c": "symbol",
      "n": "Language of flowers",
      "d": 3,
      "m": "Print in colour, plus a key",
      "t": "floriography victorian botanical meanings pressed",
      "w": "Each flower carries a conventional meaning. A pressed-flower collection or a botanical illustration becomes a sentence.",
      "x": "Pressed flowers tucked between postcards; the key is a page from a Victorian gift book in the bag.",
      "s": [
        "Language of flowers",
        "https://en.wikipedia.org/wiki/Language_of_flowers"
      ],
      "id": "language-of-flowers"
    },
    {
      "c": "symbol",
      "n": "Constellations",
      "d": 3,
      "m": "Print, possibly on transparency",
      "t": "stars sky chart overlay night navigation",
      "w": "Star patterns work as shapes to match, as an overlay to align, and as a navigation theme. Dots on any surface can be a constellation.",
      "x": "Pinholes in a card, held to a lamp, match one constellation on a star chart; that constellation names the trail.",
      "s": [
        "Constellation",
        "https://en.wikipedia.org/wiki/Constellation"
      ],
      "id": "constellations"
    },
    {
      "c": "symbol",
      "n": "Alchemical and astronomical symbols",
      "d": 2,
      "m": "Print, plus a key",
      "t": "planets metals occult glyphs apothecary",
      "w": "A ready-made glyph set with period flavour, and the planet-metal correspondences give a second layer of meaning for free.",
      "x": "Jars in an illustration are labelled with metal symbols; the one that does not belong marks the container to open next.",
      "s": [
        "Alchemical symbol",
        "https://en.wikipedia.org/wiki/Alchemical_symbol"
      ],
      "id": "alchemical-and-astronomical-symbols"
    },
    {
      "c": "symbol",
      "n": "Trail blazes and hobo signs",
      "d": 2,
      "m": "Print only",
      "t": "marks on trees waymarks chalk symbols travellers",
      "w": "Real systems of marks left by travellers for other travellers — the perfect in-world justification for a private symbol set in a journey story.",
      "x": "Chalk marks in the corner of several photographs, decoded with a key from her notebook, say which container is safe to open first.",
      "s": [
        "Trail blazing",
        "https://en.wikipedia.org/wiki/Trail_blazing"
      ],
      "id": "trail-blazes-and-hobo-signs"
    },
    {
      "c": "symbol",
      "n": "Barcode or QR code",
      "d": 1,
      "m": "Print, plus a phone",
      "t": "scan modern digital link video",
      "w": "A scan delivers a message, a video or a hint. Modern and cheap, and useful for delivering a performance — an actor, a voice, an image — that paper cannot.",
      "x": "The fictional plane ticket carries a QR code that opens her final recorded message.",
      "warn": "Breaks period immersion unless justified. In our games we keep these for the reward, not the puzzles.",
      "s": [
        "QR code",
        "https://en.wikipedia.org/wiki/QR_code"
      ],
      "id": "barcode-or-qr-code"
    },
    {
      "c": "map",
      "n": "Grid reference",
      "d": 2,
      "m": "Print with a ruled grid",
      "t": "coordinates squares lookup letters numbers",
      "w": "A lettered and numbered grid turns any map into a lookup table. The reference can come from anywhere, and the destination square holds a mark, a word or nothing at all.",
      "x": "A card mentions \"row H, the third house along.\" Square H3 on one map carries a symbol that appears nowhere else.",
      "s": [
        "Ordnance Survey National Grid",
        "https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid"
      ],
      "id": "grid-reference"
    },
    {
      "c": "map",
      "n": "Latitude and longitude",
      "d": 3,
      "m": "Print with graduated margins",
      "t": "coordinates degrees minutes navigation real places",
      "w": "Real coordinates give a real place, which can be checked against the story. Degrees and minutes also happen to be four digits.",
      "x": "Her notebook lists coordinates for the dig site; the minutes of latitude and longitude give the final four-digit code.",
      "s": [
        "Geographic coordinate system",
        "https://en.wikipedia.org/wiki/Geographic_coordinate_system"
      ],
      "id": "latitude-and-longitude"
    },
    {
      "c": "map",
      "n": "Bearing and distance",
      "d": 4,
      "m": "Print with scale bar and compass rose; a ruler or string",
      "t": "treasure map paces compass direction measure walk it out",
      "w": "The classic treasure-map instruction: start at a landmark, go so far in such a direction. Solving it means physically measuring on the map, which is the single most treasure-hunt-feeling action available.",
      "x": "\"Two hundred paces north-north-east of the customs house, where the coast bends.\" Walking it out on the map’s own scale lands on a gull drawn into the linework, with a letter beside it.",
      "warn": "Print accuracy matters. Test at true print size — a scale bar that is 2% off can move the answer into the wrong feature.",
      "s": [
        "Bearing (navigation)",
        "https://en.wikipedia.org/wiki/Bearing_(navigation)"
      ],
      "id": "bearing-and-distance"
    },
    {
      "c": "map",
      "n": "Triangulation",
      "d": 4,
      "m": "Print, plus string or a straightedge",
      "t": "three landmarks intersection lines cross bearings",
      "w": "Three bearings or three distances intersect at one point. More robust than a single bearing because errors are visible — if the lines do not meet, something was misread.",
      "x": "Three postcards each say what was visible from her window. The only point on the map with all three sightlines is the answer.",
      "s": [
        "Triangulation",
        "https://en.wikipedia.org/wiki/Triangulation"
      ],
      "id": "triangulation"
    },
    {
      "c": "map",
      "n": "Contour and terrain reading",
      "d": 3,
      "m": "Print with contours",
      "t": "elevation highest point hills topographic valley",
      "w": "Asking for the highest point, the steepest side or the only pass through a ridge forces players to read the map as terrain rather than as a picture with names on it.",
      "x": "\"She camped at the highest ground within sight of the fjord.\" Only one spot qualifies, and it is unlabelled.",
      "s": [
        "Contour line",
        "https://en.wikipedia.org/wiki/Contour_line"
      ],
      "id": "contour-and-terrain-reading"
    },
    {
      "c": "map",
      "n": "Compass rose as a cipher",
      "d": 3,
      "m": "Print with a graduated rose",
      "t": "degrees points of the compass direction wheel dial",
      "w": "A compass rose is a dial: thirty-two points, or 360 degrees, each mappable to a letter or number. It is also the least suspicious object on any map.",
      "x": "Four bearings given across four cards convert, via the rose’s lettered points, into four letters.",
      "s": [
        "Compass rose",
        "https://en.wikipedia.org/wiki/Compass_rose"
      ],
      "id": "compass-rose-as-a-cipher"
    },
    {
      "c": "map",
      "n": "The unexplained legend symbol",
      "d": 2,
      "m": "Print only",
      "t": "key legend missing meaning cross-reference between maps",
      "w": "A map legend that includes one symbol it never explains. Its meaning lives on a different prop, forcing two objects together.",
      "x": "Each of the four trail maps has one orphan symbol in its legend; the four are explained on the back of a different map each time, so all four must be in hand.",
      "s": [
        "Map legend",
        "https://en.wikipedia.org/wiki/Map#Map_legend"
      ],
      "id": "the-unexplained-legend-symbol"
    },
    {
      "c": "map",
      "n": "Map overlay / alignment",
      "d": 4,
      "m": "Two sheets, one on transparency or thin stock",
      "t": "transparency align two maps register holes light",
      "w": "Two sheets that mean nothing separately and something together. Registration is the puzzle: players must work out what lines up with what.",
      "x": "A modern map and a period chart share three coastal features. Aligned on those, a mark on the upper sheet falls on an unnamed island on the lower.",
      "warn": "Give an unambiguous registration cue — three matching features, or a cut corner. Guessy alignment is the most common way this fails.",
      "s": [
        "Overlay (cartography)",
        "https://en.wikipedia.org/wiki/Overlay_(cartography)"
      ],
      "id": "map-overlay-alignment"
    },
    {
      "c": "map",
      "n": "Fold to reveal",
      "d": 3,
      "m": "Print, scored folds",
      "t": "crease bring edges together map folding join",
      "w": "Folding a large sheet along its intended creases brings distant printed areas into contact, completing a word, a shape or a route.",
      "x": "Folded along its packing creases, a map brings two half-drawn boats together into a single vessel whose name is the answer.",
      "s": [
        "Map folding",
        "https://en.wikipedia.org/wiki/Map_folding"
      ],
      "id": "fold-to-reveal"
    },
    {
      "c": "map",
      "n": "Route drawn as a shape",
      "d": 4,
      "m": "Print, plus a wet-erase marker or cord",
      "t": "connect the dots digits letters trail legs draw",
      "w": "Connecting located points in the right order traces a shape that reads as a digit, a letter or a symbol. The ordering rule is the real puzzle; the drawing is the payoff.",
      "x": "Our Norse finale: four maps, eighteen postcards. Split by stamp, order by date, draw each trail’s legs, read four digits.",
      "warn": "Shapes must be tested at true print size with real point positions. Ambiguous digits — 1 versus 7, 9 versus 4 — are the failure case.",
      "s": [
        "Connect the dots",
        "https://en.wikipedia.org/wiki/Connect_the_dots"
      ],
      "id": "route-drawn-as-a-shape"
    },
    {
      "c": "map",
      "n": "Pin and string",
      "d": 2,
      "m": "Corkboard, pins, cord",
      "t": "thread cord conspiracy board tactile connect physical",
      "w": "Physical connections between points instead of drawn ones. Slower, more tactile, more repositionable, and it looks magnificent on a table.",
      "x": "Cord run between pinned postcards, with the length of cord used being a second, hidden measurement.",
      "warn": "Needs a surface that takes pins and a flat working area. Laminate-and-marker is more forgiving for a portable game.",
      "s": [
        "Top 15 Puzzle Ideas",
        "https://escaperoomtips.com/design/escape-room-puzzle-ideas/"
      ],
      "id": "pin-and-string"
    },
    {
      "c": "map",
      "n": "North is not up",
      "d": 3,
      "m": "Print only",
      "t": "rotated orientation upside down compass wrong way",
      "w": "A map drawn with north somewhere other than the top. Everything players assume about direction quietly stops working until they notice the rose.",
      "x": "One of four maps is drawn with north to the left, so a bearing instruction that works on the other three produces nonsense until the map is turned.",
      "s": [
        "Cardinal direction",
        "https://en.wikipedia.org/wiki/Cardinal_direction"
      ],
      "id": "north-is-not-up"
    },
    {
      "c": "map",
      "n": "Historic versus modern comparison",
      "d": 3,
      "m": "Two printed maps",
      "t": "differences changed names then and now spot the difference",
      "w": "The same place at two dates. What changed — a renamed town, a vanished island, a moved coastline — is the clue.",
      "x": "A place named on a period chart no longer exists on the modern map. Its old name is the word lock answer.",
      "s": [
        "Historical map",
        "https://en.wikipedia.org/wiki/Early_world_maps"
      ],
      "id": "historic-versus-modern-comparison"
    },
    {
      "c": "map",
      "n": "Place-name initials",
      "d": 2,
      "m": "Print only",
      "t": "first letters of towns spell word order route",
      "w": "The initials of located places, taken in route order, spell a word. The map supplies the letters and the route supplies the order.",
      "x": "Six stops along one trail spell a six-letter word when read in date order — and only in date order.",
      "s": [
        "Acrostic",
        "https://en.wikipedia.org/wiki/Acrostic"
      ],
      "id": "place-name-initials"
    },
    {
      "c": "map",
      "n": "Distance table lookup",
      "d": 2,
      "m": "Print only",
      "t": "mileage chart matrix road atlas grid numbers",
      "w": "The triangular mileage chart printed in every road atlas is a ready-made lookup grid that nobody reads as a puzzle device.",
      "x": "\"How far did I travel between the second and fifth stop?\" The chart answers in a number that is the code.",
      "s": [
        "Distance matrix",
        "https://en.wikipedia.org/wiki/Distance_matrix"
      ],
      "id": "distance-table-lookup"
    },
    {
      "c": "map",
      "n": "The map back as a document",
      "d": 1,
      "m": "Print double-sided",
      "t": "reverse side flip it over manifest log docket",
      "w": "Print the back as something in-world — a manifest, a customs docket, a log page — so flipping the map is rewarding without the back ever announcing itself as the clue side.",
      "x": "Every trail map backs onto a shipping manifest for that leg, and the manifest quantities carry the digits.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "the-map-back-as-a-document"
    },
    {
      "c": "map",
      "n": "Hidden mark in the linework",
      "d": 3,
      "m": "Careful artwork",
      "t": "tiny detail illustration gull rock buoy magnifier find",
      "w": "A small mark drawn into decorative detail — a bird, a rock, a ship — that is invisible until a separate clue tells players exactly where to look.",
      "x": "The endpoint of a bearing puzzle. Unfindable by searching, obvious once measured, which is exactly the right balance.",
      "warn": "Never make finding it the puzzle. A mark this small must be arrived at, not hunted.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "hidden-mark-in-the-linework"
    },
    {
      "c": "map",
      "n": "Missing region",
      "d": 3,
      "m": "Print with a cut or torn area",
      "t": "hole torn away absent gap shape of the hole",
      "w": "What has been removed is the answer: the shape of the hole, or the one place the map refuses to show.",
      "x": "A burnt corner removes exactly one stop. Its identity is recoverable from the postcards, and that recovery is the puzzle.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "missing-region"
    },
    {
      "c": "map",
      "n": "Star chart over a map",
      "d": 4,
      "m": "Two sheets, one transparent",
      "t": "constellation overlay cities as stars align sky ground",
      "w": "A constellation laid over a map matches city dots to stars. Two unrelated-looking props turn out to be the same shape.",
      "x": "Aligning a star chart with the route map shows one city with no star and one star with no city — the missing stop.",
      "s": [
        "Celestial cartography",
        "https://en.wikipedia.org/wiki/Celestial_cartography"
      ],
      "id": "star-chart-over-a-map"
    },
    {
      "c": "map",
      "n": "Border as a ruler",
      "d": 3,
      "m": "Print with graduated margin",
      "t": "margin ticks measuring edge scale straightedge",
      "w": "The decorative border carries tick marks that are a measuring scale, a cipher strip, or an index — so the map is also the tool for reading itself.",
      "x": "The map margin’s tick marks align with notches on a wooden prop, and where they coincide gives a number.",
      "s": [
        "Vernier scale",
        "https://en.wikipedia.org/wiki/Vernier_scale"
      ],
      "id": "border-as-a-ruler"
    },
    {
      "c": "map",
      "n": "Floor plan and physical space",
      "d": 3,
      "m": "A printed plan of a real room",
      "t": "building layout room walk to it real world location",
      "w": "A plan of an actual space the players are in, turning the game into a short hunt through the house or garden.",
      "x": "Our Aurora station map works this way at the concept level: compartments on the plan correspond to places to physically go.",
      "warn": "Only works if you control the venue. Bad for a game that has to travel or be played at a table.",
      "s": [
        "Floor plan",
        "https://en.wikipedia.org/wiki/Floor_plan"
      ],
      "id": "floor-plan-and-physical-space"
    },
    {
      "c": "map",
      "n": "Transit or route diagram",
      "d": 3,
      "m": "Print only",
      "t": "metro lines stations connections network schematic",
      "w": "A schematic network — lines, stations, interchanges — is a graph puzzle that looks like wayfinding. Counting stops, finding the only interchange, or tracing a line all extract numbers.",
      "x": "A period railway diagram where the number of stops between two named stations gives each digit.",
      "s": [
        "Transit map",
        "https://en.wikipedia.org/wiki/Transit_map"
      ],
      "id": "transit-or-route-diagram"
    },
    {
      "c": "prop",
      "n": "Cipher disk",
      "d": 2,
      "m": "Two printed discs and a split pin",
      "t": "wheel rotate alignment volvelle decoder ring",
      "w": "Two rotating discs align one alphabet against another. Setting the disc is the key, so \"align the raven with the north point\" is a complete instruction.",
      "x": "A brass-look disc among her effects, with a card that says which two marks to line up.",
      "s": [
        "Cipher disk",
        "https://en.wikipedia.org/wiki/Cipher_disk"
      ],
      "id": "cipher-disk"
    },
    {
      "c": "prop",
      "n": "Jefferson disk / wheel cypher",
      "d": 4,
      "m": "Printed or 3D-printed stack of discs",
      "t": "rotating wheels rows align message column",
      "w": "A stack of lettered wheels turned until one row spells the known phrase; another row then reads as the answer. Deeply satisfying to handle.",
      "x": "Ten wheels; aligning them to spell the aunt’s name makes an adjacent row read as the next instruction.",
      "s": [
        "Jefferson disk",
        "https://en.wikipedia.org/wiki/Jefferson_disk"
      ],
      "id": "jefferson-disk-wheel-cypher"
    },
    {
      "c": "prop",
      "n": "Cryptex",
      "d": 2,
      "m": "3D print or purchase",
      "t": "rings letters combination cylinder vessel container",
      "w": "A cylinder that opens when its lettered rings spell a word. It is a word lock that also holds the reward, so the moment of opening and the moment of solving are the same.",
      "x": "Five rings, five branch runes, one five-letter answer. Holds the next postcards.",
      "warn": "A cryptex and a five-letter word padlock in the same game is one word lock too many. Pick one.",
      "s": [
        "Cryptex",
        "https://en.wikipedia.org/wiki/Cryptex"
      ],
      "id": "cryptex"
    },
    {
      "c": "prop",
      "n": "Puzzle box",
      "d": 3,
      "m": "Purchase, or build",
      "t": "himitsu-bako sliding panels sequence open japanese",
      "w": "A box that opens through a sequence of hidden moves. Pure tactile discovery, needs no code at all, and resets perfectly for reuse.",
      "x": "Holds the final reward, with the move sequence hinted by a card rather than printed on the box.",
      "s": [
        "Puzzle box",
        "https://en.wikipedia.org/wiki/Puzzle_box"
      ],
      "id": "puzzle-box"
    },
    {
      "c": "prop",
      "n": "Hidden compartment",
      "d": 2,
      "m": "Craft work on an object",
      "t": "false bottom hollow book secret drawer lining",
      "w": "A false bottom, a hollowed book, a lining that opens. Rewards the habit of handling objects properly rather than reading them.",
      "x": "The bag’s base panel lifts out once the board puzzle releases it, revealing the last postcards.",
      "s": [
        "Hidden compartment",
        "https://en.wikipedia.org/wiki/Hidden_compartment"
      ],
      "id": "hidden-compartment"
    },
    {
      "c": "prop",
      "n": "Magnet and reed switch",
      "d": 2,
      "m": "Magnet, reed switch, small circuit",
      "t": "electronics trigger invisible wand hidden release click",
      "w": "A magnet hidden in an innocuous prop trips a switch hidden in furniture — a drawer releases, a light comes on. The cause is invisible, which reads as magic.",
      "x": "A magnetised compass needle held against the right point on the bag releases a catch.",
      "warn": "The only electronics on this list. Adds batteries, failure modes and reset steps to a game that otherwise needs none.",
      "s": [
        "Escape room sensors",
        "https://www.escaperoomsupplier.com/6-must-have-escape-room-sensors-that-turn-your-creative-ideas-into-magical-experiences-no-tech-skills-required/"
      ],
      "id": "magnet-and-reed-switch"
    },
    {
      "c": "prop",
      "n": "Mechanical release",
      "d": 3,
      "m": "Build work, no lock",
      "t": "no code catch latch king piece opens compartment tactile",
      "w": "A compartment that opens because something was physically placed, moved or completed — no dial, no code. Usually the best-remembered moment in a game.",
      "x": "The throne compartment under the hnefatafl board opens when the king reaches a corner square.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "mechanical-release"
    },
    {
      "c": "prop",
      "n": "Balance scale",
      "d": 3,
      "m": "A small balance and weighted objects",
      "t": "weigh heavier lighter order compare coins",
      "w": "Weighing orders objects without printing a single number. It also makes \"which of these is false\" a physical question.",
      "x": "Three coins weighed against each other give an order; that order is the order of three postcards.",
      "s": [
        "Balance puzzle",
        "https://en.wikipedia.org/wiki/Balance_puzzle"
      ],
      "id": "balance-scale"
    },
    {
      "c": "prop",
      "n": "Measuring with a prop",
      "d": 3,
      "m": "Any object with a known dimension",
      "t": "ruler string comb teeth spacing units thumb",
      "w": "An everyday object becomes the unit of measurement: a comb’s tooth spacing, a strap’s length, a coin’s diameter. It makes an ordinary object into an instrument.",
      "x": "\"Three comb-widths west of the harbour.\" The comb is already in the bag for another puzzle entirely.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "measuring-with-a-prop"
    },
    {
      "c": "prop",
      "n": "Torn document reassembly",
      "d": 2,
      "m": "Print and tear",
      "t": "jigsaw pieces fit together edges match reconstruct",
      "w": "A document in pieces. The edges themselves verify the solution, and reassembly is a good task for the player who has not found a job yet.",
      "x": "A letter torn into six, distributed across three containers, so it can only be completed late.",
      "s": [
        "Jigsaw puzzle",
        "https://en.wikipedia.org/wiki/Jigsaw_puzzle"
      ],
      "id": "torn-document-reassembly"
    },
    {
      "c": "prop",
      "n": "Arrangement as data",
      "d": 3,
      "m": "Any set of objects",
      "t": "face up down orientation rotation layout order state",
      "w": "Not what the objects are, but how they are arranged: face up or down, rotated, stacked, spaced. A row of ordinary items becomes binary or a sequence.",
      "x": "\"I have set it up as I left it.\" Which pieces face which way on the board is the recoverable state.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "arrangement-as-data"
    },
    {
      "c": "prop",
      "n": "Sort by physical property",
      "d": 2,
      "m": "A set of varied objects",
      "t": "size weight colour age heaviest smallest ordering",
      "w": "Order a set by something only handling reveals — weight, size, wear, warmth, smell. Produces an ordering without printing one.",
      "x": "Five stones ordered by size give the order in which five cards are read.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "sort-by-physical-property"
    },
    {
      "c": "prop",
      "n": "Wax seal",
      "d": 2,
      "m": "Sealing wax and a stamp",
      "t": "impression emboss crest break the seal period",
      "w": "An impressed seal carries a small image, and breaking it is a one-way, ceremonial act that marks a turning point in the game.",
      "x": "The final envelope is sealed with the family crest — the same crest that was a bind-rune puzzle two locks earlier.",
      "s": [
        "Seal (emblem)",
        "https://en.wikipedia.org/wiki/Seal_(emblem)"
      ],
      "id": "wax-seal"
    },
    {
      "c": "prop",
      "n": "Postmarks and stamps",
      "d": 2,
      "m": "Print only",
      "t": "dates cancellation philately place issue perforations",
      "w": "A postmark is a date and a place stamped on an object that has an entirely different apparent purpose. Perforation counts, stamp values and issue dates are all free numbers.",
      "x": "Postmarks supply the dates that order eighteen cards for the finale, while individually reading as nothing more than postal realism.",
      "s": [
        "Postmark",
        "https://en.wikipedia.org/wiki/Postmark"
      ],
      "id": "postmarks-and-stamps"
    },
    {
      "c": "prop",
      "n": "Coins: dates and mint marks",
      "d": 3,
      "m": "Real or replica coins",
      "t": "currency mint mark year denomination numismatic",
      "w": "Coins carry a date, a mint mark, a denomination and an image — four independent data points on an object players will happily pick up.",
      "x": "Three coins from three cities; the mint marks identify which three postcards matter.",
      "s": [
        "Mint mark",
        "https://en.wikipedia.org/wiki/Mint_mark"
      ],
      "id": "coins-dates-and-mint-marks"
    },
    {
      "c": "prop",
      "n": "Keys as a set",
      "d": 2,
      "m": "Several keys and locks",
      "t": "which key fits elimination try them notches profile",
      "w": "More keys than locks, or more locks than keys. Matching them is a puzzle requiring no reading, and the process is satisfyingly physical.",
      "x": "Five keys, one lock. The right key is identified by a notch pattern matching a diagram, so guessing by trying is slower than solving.",
      "warn": "If trying every key is faster than solving, the puzzle is decorative. Keep key counts high or make trial costly.",
      "s": [
        "Lock and key",
        "https://en.wikipedia.org/wiki/Lock_and_key"
      ],
      "id": "keys-as-a-set"
    },
    {
      "c": "prop",
      "n": "Sundial or shadow cast",
      "d": 4,
      "m": "A dial or gnomon prop, plus a light",
      "t": "shadow light angle time of day pointer casts",
      "w": "An object casting a shadow onto a marked surface. The shadow points at the answer only when the light is in the right place.",
      "x": "A stylus set into a printed dial; held under the room lamp, the shadow falls on one of eighteen place names.",
      "warn": "Ambient light conditions vary wildly between play sessions. Test in the actual room, or supply the light source.",
      "s": [
        "Sundial",
        "https://en.wikipedia.org/wiki/Sundial"
      ],
      "id": "sundial-or-shadow-cast"
    },
    {
      "c": "prop",
      "n": "Planisphere / rotating overlay",
      "d": 3,
      "m": "Two printed discs",
      "t": "star wheel date window rotate reveal aperture",
      "w": "A disc with a window rotated over a printed wheel shows only part of what is underneath. Setting the date or the name exposes the right fragment.",
      "x": "Setting the wheel to the date on a postmark reveals a single word through the window.",
      "s": [
        "Planisphere",
        "https://en.wikipedia.org/wiki/Planisphere"
      ],
      "id": "planisphere-rotating-overlay"
    },
    {
      "c": "prop",
      "n": "Magnifier and micro-text",
      "d": 1,
      "m": "Print at high resolution, plus a loupe",
      "t": "tiny text magnifying glass microdot small print",
      "w": "Text printed too small to read unaided. The prop supplies the ability, so handing over the magnifier is itself a hint.",
      "x": "The \"engraver’s signature\" on a stamp illustration is a full sentence at 2pt.",
      "warn": "Depends entirely on print quality. Test on the actual printer before designing a puzzle around it.",
      "s": [
        "Microdot",
        "https://en.wikipedia.org/wiki/Microdot"
      ],
      "id": "magnifier-and-micro-text"
    },
    {
      "c": "prop",
      "n": "Nested containers",
      "d": 1,
      "m": "Boxes, tins, envelopes",
      "t": "matryoshka box inside box layers unwrap",
      "w": "Containers inside containers, each with its own lock. Cheap structure, strong pacing, and it makes progress physically visible.",
      "x": "An envelope inside a tin inside a pouch, each opened by a different technique.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "nested-containers"
    },
    {
      "c": "prop",
      "n": "Dexterity retrieval",
      "d": 2,
      "m": "A container and an awkward object",
      "t": "fishing tweezers narrow neck reach retrieve physical skill",
      "w": "A key or card visible but hard to reach — down a narrow tube, frozen in ice, under a grate. Not intellectual at all, which is the point: it varies the rhythm.",
      "x": "A key at the bottom of a long tube, retrievable with the magnet already used in another puzzle.",
      "warn": "Never make it physically demanding or frustrating. Thirty seconds of fiddling is charming, five minutes is not.",
      "s": [
        "Top 15 Puzzle Ideas",
        "https://escaperoomtips.com/design/escape-room-puzzle-ideas/"
      ],
      "id": "dexterity-retrieval"
    },
    {
      "c": "prop",
      "n": "Directional lock",
      "d": 2,
      "m": "Purchase",
      "t": "arrows up down combination sequence padlock gesture",
      "w": "A padlock opened by a sequence of arrow presses rather than digits. Useful because arrows can be encoded as anything with direction: a route, a compass, a dance, a drawn line.",
      "x": "The path traced on a map converts directly into the up-down-left-right sequence.",
      "s": [
        "Padlock",
        "https://en.wikipedia.org/wiki/Padlock"
      ],
      "id": "directional-lock"
    },
    {
      "c": "prop",
      "n": "Word padlock",
      "d": 2,
      "m": "Purchase",
      "t": "letter dials five letters self-verifying combination",
      "w": "A letter-dial padlock. Its virtue is self-verification: a wrong word is obviously wrong, so players know whether they have solved it without asking.",
      "x": "KAMBR, Old Norse for comb — and opening it is how players learn the comb is an instrument.",
      "s": [
        "Padlock",
        "https://en.wikipedia.org/wiki/Padlock"
      ],
      "id": "word-padlock"
    },
    {
      "c": "prop",
      "n": "Two-person simultaneous action",
      "d": 3,
      "m": "Two props, or distance",
      "t": "cooperation both at once teamwork separate hold together",
      "w": "Something that cannot be done alone: two catches held at once, one player reading while another aligns. Forces the group to talk, which is what makes a shared game good.",
      "x": "The hold-to-light pair needs one person holding the cards and another reading from the far side.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "two-person-simultaneous-action"
    },
    {
      "c": "prop",
      "n": "Quipu / knot record",
      "d": 4,
      "m": "Cord and beads",
      "t": "knots string counting tactile andean rope",
      "w": "Knots on cords recording numbers by count and position. Tactile, unusual, and solvable in the dark.",
      "x": "A knotted cord wound round a journal records the number of stops on each trail.",
      "s": [
        "Quipu",
        "https://en.wikipedia.org/wiki/Quipu"
      ],
      "id": "quipu-knot-record"
    },
    {
      "c": "prop",
      "n": "Playing cards and dominoes",
      "d": 2,
      "m": "A deck or set",
      "t": "suits pips values ordering standard components",
      "w": "Ready-made components with number, suit and orientation built in, that no player treats as suspicious.",
      "x": "Four cards left in a drawer; their pip values are the code and their suits give the order.",
      "s": [
        "Playing card",
        "https://en.wikipedia.org/wiki/Playing_card"
      ],
      "id": "playing-cards-and-dominoes"
    },
    {
      "c": "material",
      "n": "UV invisible ink",
      "d": 1,
      "m": "UV pen and a small torch",
      "t": "blacklight glowing secret writing ultraviolet lamp",
      "w": "Writing visible only under ultraviolet light. The most recognisable escape-room trick there is, which makes it fast and satisfying rather than clever.",
      "x": "A UV torch found early becomes a tool used four times across the game, each time on something players have already handled.",
      "warn": "Now a cliché. Its value is as a tool players learn to carry, not as a surprise.",
      "s": [
        "Invisible ink",
        "https://en.wikipedia.org/wiki/Invisible_ink"
      ],
      "id": "uv-invisible-ink"
    },
    {
      "c": "material",
      "n": "Heat-revealed ink",
      "d": 2,
      "m": "Lemon juice or milk, plus a heat source",
      "t": "lemon juice candle iron browning secret writing period",
      "w": "Organic inks that brown before the paper does. Period-appropriate for any historical setting, and the reveal is gradual and theatrical.",
      "x": "A blank-looking page warmed on a radiator slowly shows her handwriting.",
      "warn": "Needs a safe heat source. Irreversible, so the page cannot be reused between plays.",
      "s": [
        "Invisible ink",
        "https://en.wikipedia.org/wiki/Invisible_ink"
      ],
      "id": "heat-revealed-ink"
    },
    {
      "c": "material",
      "n": "Thermochromic ink",
      "d": 1,
      "m": "Purchased ink or printed card",
      "t": "rub to reveal warm hands heat sensitive colour change resettable",
      "w": "Ink that changes colour with warmth — rub it, hold it, breathe on it. Resets itself when it cools, which makes it ideal for a reusable game.",
      "x": "A black patch on a card becomes transparent under a thumb, revealing a digit underneath.",
      "s": [
        "Thermochromism",
        "https://en.wikipedia.org/wiki/Thermochromism"
      ],
      "id": "thermochromic-ink"
    },
    {
      "c": "material",
      "n": "Hold-to-light overlay",
      "d": 2,
      "m": "Two sheets, one on lighter stock",
      "t": "backlit two cards combine lamp window transparency layering",
      "w": "Two printed sheets, each carrying half a mark. Overlaid and lit from behind, the halves complete each other. Costs nothing but print, and the gesture is memorable.",
      "x": "Postcards 02 and 03 held together against a lamp complete a figure neither card contains. Already in production for the Norse bag.",
      "warn": "Alignment must be unambiguous — match a printed border, an edge or a hole, not a guessed position.",
      "s": [
        "Lithophane",
        "https://en.wikipedia.org/wiki/Lithophane"
      ],
      "id": "hold-to-light-overlay"
    },
    {
      "c": "material",
      "n": "Watermark",
      "d": 2,
      "m": "Specialty paper, or a printed fake",
      "t": "paper held to light maker mark ghost image authentic",
      "w": "A mark visible only when the sheet is held up. Reads as paper provenance rather than as a message, so it survives close inspection without being found.",
      "x": "One sheet among many carries a different watermark, identifying which document is the genuine one.",
      "s": [
        "Watermark",
        "https://en.wikipedia.org/wiki/Watermark"
      ],
      "id": "watermark"
    },
    {
      "c": "material",
      "n": "Lithophane",
      "d": 4,
      "m": "3D printing",
      "t": "3d printed thickness image appears backlit translucent",
      "w": "A thin panel whose varying thickness shows an image only when backlit. Completely blank-looking until held to a lamp.",
      "x": "A \"bone disc\" among her artefacts shows a map when held against a window.",
      "s": [
        "Lithophane",
        "https://en.wikipedia.org/wiki/Lithophane"
      ],
      "id": "lithophane"
    },
    {
      "c": "material",
      "n": "Colour-filter decoding",
      "d": 2,
      "m": "Colour print and a red acetate",
      "t": "red filter overlay hidden among noise decoder glasses",
      "w": "A message printed in one colour buried in noise of another. Viewed through a matching filter, the noise vanishes and the message stands alone.",
      "x": "A dense pattern of red and blue marks on a map resolves, under a red film, into three place names.",
      "warn": "Requires accurate colour printing. Test the actual print and the actual filter together — home printers shift hues badly.",
      "s": [
        "Colour filter",
        "https://en.wikipedia.org/wiki/Optical_filter"
      ],
      "id": "colour-filter-decoding"
    },
    {
      "c": "material",
      "n": "Moiré reveal",
      "d": 4,
      "m": "Two precisely printed line patterns",
      "t": "interference lines stripes overlay pattern appears",
      "w": "Two fine line patterns overlaid produce an image neither contains. Visually spectacular and genuinely mysterious.",
      "x": "A striped decorative panel on a card, overlaid with a striped transparency, shows a number.",
      "warn": "Needs precise print registration and matched line pitch. Prototype before committing.",
      "s": [
        "Moiré pattern",
        "https://en.wikipedia.org/wiki/Moir%C3%A9_pattern"
      ],
      "id": "moire-reveal"
    },
    {
      "c": "material",
      "n": "Lenticular print",
      "d": 3,
      "m": "Commercial print, or a ridged overlay",
      "t": "tilt to see changes angle two images flip",
      "w": "An image that changes as the viewing angle changes. Two messages occupy the same surface.",
      "x": "A postcard front that shows a ship from one angle and a route line from another.",
      "warn": "Commercial printing cost. A cheap substitute is a ridged transparent overlay over interleaved strips.",
      "s": [
        "Lenticular printing",
        "https://en.wikipedia.org/wiki/Lenticular_printing"
      ],
      "id": "lenticular-print"
    },
    {
      "c": "material",
      "n": "Anamorphic image",
      "d": 4,
      "m": "Print, plus a cylindrical mirror or a viewing point",
      "t": "distorted stretched view from angle perspective mirror cylinder",
      "w": "A distorted image that resolves when viewed from one specific angle or reflected in a curved mirror. The puzzle is discovering where to stand.",
      "x": "A smear of ink across a map back becomes a word when the sheet is viewed edge-on from the bottom right.",
      "s": [
        "Anamorphosis",
        "https://en.wikipedia.org/wiki/Anamorphosis"
      ],
      "id": "anamorphic-image"
    },
    {
      "c": "material",
      "n": "Pinholes in paper",
      "d": 2,
      "m": "A pin",
      "t": "perforations held to light dots constellation braille",
      "w": "Holes pricked through a sheet are invisible flat and obvious backlit. Cheapest hidden-message technique that exists.",
      "x": "Pinholes through a postcard mark which letters of the printed caption matter.",
      "s": [
        "Steganography",
        "https://en.wikipedia.org/wiki/Steganography"
      ],
      "id": "pinholes-in-paper"
    },
    {
      "c": "material",
      "n": "Raking light and embossing",
      "d": 3,
      "m": "Blind embossing or heavy pen pressure",
      "t": "impression indentation pressed writing pencil rubbing side light",
      "w": "An impression with no ink: pressed writing on the sheet beneath, or a blind-embossed mark. Revealed by low-angle light or a pencil rubbing.",
      "x": "The notepad page beneath the one she tore out still carries the impression of an address.",
      "s": [
        "Embossing (paper)",
        "https://en.wikipedia.org/wiki/Embossing_(paper)"
      ],
      "id": "raking-light-and-embossing"
    },
    {
      "c": "material",
      "n": "Water reveal",
      "d": 3,
      "m": "Treated paper, plus water",
      "t": "wet dip damp sponge appears soaked",
      "w": "Marks that appear when the paper is dampened. Unusual enough that players rarely think of it unprompted, so it needs a strong cue.",
      "x": "\"The sea took the rest of it.\" A card dipped in water shows the missing half.",
      "warn": "Irreversible and messy. Poor fit for a reusable game.",
      "s": [
        "Invisible ink",
        "https://en.wikipedia.org/wiki/Invisible_ink"
      ],
      "id": "water-reveal"
    },
    {
      "c": "material",
      "n": "Glow in the dark",
      "d": 2,
      "m": "Phosphorescent paint or print",
      "t": "darkness lights off charge luminous afterglow",
      "w": "Marks that appear only when the lights go out. Turning off the lights is itself a dramatic beat and a good mid-game reset.",
      "x": "The ceiling of a container shows a constellation once the room is dark.",
      "s": [
        "Phosphorescence",
        "https://en.wikipedia.org/wiki/Phosphorescence"
      ],
      "id": "glow-in-the-dark"
    },
    {
      "c": "material",
      "n": "Scratch-off coating",
      "d": 1,
      "m": "Scratch-off stickers or paint",
      "t": "reveal lottery silver panel one-time irreversible",
      "w": "A covered answer revealed by scratching. Mostly used for hints, because it is irreversible and self-limiting: players can spend a hint without asking anyone.",
      "x": "Three scratch panels on the inside of the bag lid hold the hint ladder for the hardest puzzle.",
      "s": [
        "Scratchcard",
        "https://en.wikipedia.org/wiki/Scratchcard"
      ],
      "id": "scratch-off-coating"
    },
    {
      "c": "material",
      "n": "Torn-edge matching",
      "d": 2,
      "m": "Print and tear",
      "t": "deckle fits together provenance which page came from",
      "w": "A torn edge fits exactly one other torn edge, proving two documents belong together without either saying so.",
      "x": "A scrap in one container matches the tear on a letter in another, identifying which of four letters is the genuine one.",
      "s": [
        "Jigsaw puzzle",
        "https://en.wikipedia.org/wiki/Jigsaw_puzzle"
      ],
      "id": "torn-edge-matching"
    },
    {
      "c": "material",
      "n": "Cut-out window mask",
      "d": 2,
      "m": "Print plus a cut card",
      "t": "stencil aperture frame shows only part overlay",
      "w": "A card with a window laid over a page, or over a map, showing only the relevant region. Simpler than a grille and easier to align.",
      "x": "A window cut in a photograph mount frames exactly one square of a gridded map.",
      "s": [
        "Cardan grille",
        "https://en.wikipedia.org/wiki/Cardan_grille"
      ],
      "id": "cut-out-window-mask"
    },
    {
      "c": "material",
      "n": "Aged and stained surfaces",
      "d": 2,
      "m": "Tea, coffee, careful burning",
      "t": "weathering damage foxing burnt edges patina hides",
      "w": "Deliberate damage that hides a mark in plain sight — a stain that is actually a shape, foxing that conceals a dot, a burn that removes exactly one word.",
      "x": "A \"coffee ring\" on a map back is a perfect circle around one settlement.",
      "s": [
        "Foxing",
        "https://en.wikipedia.org/wiki/Foxing"
      ],
      "id": "aged-and-stained-surfaces"
    },
    {
      "c": "material",
      "n": "Spectrogram in audio",
      "d": 5,
      "m": "Audio file, phone with a spectrogram app",
      "t": "sound image hidden in waveform frequency modern digital",
      "w": "An image drawn into the frequency content of a sound file, visible in a spectrogram viewer. Deeply hidden and very modern.",
      "x": "A recording of her voice has a number drawn into the background hiss.",
      "warn": "Needs a phone, an app, and a player who thinks to look. Too obscure for a main path without heavy cueing.",
      "s": [
        "Spectrogram",
        "https://en.wikipedia.org/wiki/Spectrogram"
      ],
      "id": "spectrogram-in-audio"
    },
    {
      "c": "logic",
      "n": "Constraint ordering",
      "d": 3,
      "m": "Print only",
      "t": "zebra logic grid deduction rules sequence arrange",
      "w": "A set of items and a handful of rules that together permit exactly one arrangement. No props, runs in parallel with physical work, and scales smoothly with the number of rules.",
      "x": "\"The root comes before the well. The bridge follows immediately after the well. The crown closes the tale.\" Four illustrated strips, one valid order, four digits read off.",
      "s": [
        "Zebra puzzle",
        "https://en.wikipedia.org/wiki/Zebra_Puzzle"
      ],
      "id": "constraint-ordering"
    },
    {
      "c": "logic",
      "n": "Elimination grid",
      "d": 3,
      "m": "Print only",
      "t": "who what where matrix cross off only one candidate",
      "w": "Several attributes, several candidates, and clues that rule out all but one. Feels like detective work, which suits archive and family-history stories.",
      "x": "Four ancestors, three sources, one person matching all three. Her archive number is the code.",
      "s": [
        "Logic puzzle",
        "https://en.wikipedia.org/wiki/Logic_puzzle"
      ],
      "id": "elimination-grid"
    },
    {
      "c": "logic",
      "n": "Odd one out",
      "d": 1,
      "m": "Print only",
      "t": "which does not belong exception spot the difference",
      "w": "One item in a set breaks the pattern, and the break is the answer. Fast, universally understood, and good as a first puzzle.",
      "x": "Seventeen postmarks share a franking style; one does not. That card is the one that matters.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "odd-one-out"
    },
    {
      "c": "logic",
      "n": "Date arithmetic",
      "d": 2,
      "m": "Print only",
      "t": "years apart subtract dates history anniversary",
      "w": "Two dates and the gap between them, or a date plus a stated interval. Numbers already present in a historical story, combined rather than found.",
      "x": "The year of the settlement minus the year of the excavation gives a three-digit number.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "date-arithmetic"
    },
    {
      "c": "logic",
      "n": "Sequence continuation",
      "d": 3,
      "m": "Print only",
      "t": "next in series pattern fibonacci progression",
      "w": "A sequence with the next term missing. Works best when the sequence is in-world — dig layers, catalogue numbers, ship departures — rather than abstract mathematics.",
      "x": "Five artefact numbers follow a rule; the sixth, missing, is the code.",
      "warn": "Ambiguity is the risk — many sequences admit more than one rule. Give at least five terms and test on someone else.",
      "s": [
        "Integer sequence",
        "https://en.wikipedia.org/wiki/Integer_sequence"
      ],
      "id": "sequence-continuation"
    },
    {
      "c": "logic",
      "n": "Nonogram / picross",
      "d": 4,
      "m": "Print only",
      "t": "grid numbers fill squares image emerges picture",
      "w": "Row and column counts that dictate which squares to fill, producing a picture. Long to solve but completely self-verifying.",
      "x": "A filled grid reveals a rune, which is the answer to a separate lock.",
      "warn": "Twenty minutes for a group that enjoys them, and a brick wall for one that does not. Keep grids under 10×10.",
      "s": [
        "Nonogram",
        "https://en.wikipedia.org/wiki/Nonogram"
      ],
      "id": "nonogram-picross"
    },
    {
      "c": "logic",
      "n": "Magic square",
      "d": 3,
      "m": "Print only",
      "t": "rows columns sum equal missing number grid",
      "w": "A grid where every row and column sums to the same total. Missing cells are recoverable, and the grid has genuine historical and occult associations.",
      "x": "A carved square on an artefact with four cells worn away; the missing values are the code.",
      "s": [
        "Magic square",
        "https://en.wikipedia.org/wiki/Magic_square"
      ],
      "id": "magic-square"
    },
    {
      "c": "logic",
      "n": "Maze or path finding",
      "d": 2,
      "m": "Print only",
      "t": "labyrinth route through trace path turns",
      "w": "A route through a maze, where what matters is not arriving but what is passed along the way, or the sequence of turns taken.",
      "x": "The turns taken through a printed labyrinth, recorded as left and right, drive a directional lock.",
      "s": [
        "Maze",
        "https://en.wikipedia.org/wiki/Maze"
      ],
      "id": "maze-or-path-finding"
    },
    {
      "c": "logic",
      "n": "Weighing deduction",
      "d": 4,
      "m": "A balance and a set of objects",
      "t": "find the fake counterfeit coin three weighings",
      "w": "Identify the odd object in a limited number of weighings. A genuine classic, and physically satisfying with a real balance.",
      "x": "Nine replica coins, one lighter. Two weighings find it, and its mint mark is the answer.",
      "s": [
        "Balance puzzle",
        "https://en.wikipedia.org/wiki/Balance_puzzle"
      ],
      "id": "weighing-deduction"
    },
    {
      "c": "logic",
      "n": "Checksum / self-verifying code",
      "d": 3,
      "m": "Print only",
      "t": "digits sum to confirm validation check your answer",
      "w": "A rule the correct answer must satisfy — digits summing to a stated total, or a stated first digit. Lets players confirm themselves rather than burning attempts on a lock.",
      "x": "\"All four add to nineteen.\" Players who derive 1972 can check it before touching the padlock.",
      "s": [
        "Checksum",
        "https://en.wikipedia.org/wiki/Checksum"
      ],
      "id": "checksum-self-verifying-code"
    },
    {
      "c": "logic",
      "n": "Base and binary conversion",
      "d": 4,
      "m": "Print, plus a key",
      "t": "binary ones zeros base conversion two states",
      "w": "Any two-state pattern is binary: dark and light beads, open and closed shutters, filled and empty circles. Converting gives numbers.",
      "x": "A decorative border of filled and hollow diamonds converts to three two-digit numbers.",
      "warn": "Supply the conversion key in-world. Assuming binary literacy is an outside-knowledge failure.",
      "s": [
        "Binary number",
        "https://en.wikipedia.org/wiki/Binary_number"
      ],
      "id": "base-and-binary-conversion"
    },
    {
      "c": "logic",
      "n": "Matching pairs",
      "d": 1,
      "m": "Print only",
      "t": "match these to those correspondence link two sets",
      "w": "Two sets that pair up one-to-one, with the leftover item, or the pairing order, as the answer.",
      "x": "Nine stamps and eight destinations. The unmatched stamp names the next container.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "matching-pairs"
    },
    {
      "c": "logic",
      "n": "Counting a physical set",
      "d": 1,
      "m": "Any collection",
      "t": "how many objects tally count them number",
      "w": "The answer is simply how many of something there are — windows in an illustration, beads on a cord, structures in a photograph.",
      "x": "\"Eight timber-and-sod structures,\" contradicted in her handwriting. Counting the photograph settles it.",
      "s": [
        "Tally marks",
        "https://en.wikipedia.org/wiki/Tally_marks"
      ],
      "id": "counting-a-physical-set"
    },
    {
      "c": "combine",
      "n": "Pointer",
      "d": 1,
      "m": "Structural",
      "t": "answer names the next prop passport signpost no lock needed where to look",
      "w": "The answer is the name of an object already in play — PASSPORT, COMB, a place named on a card. It gates attention rather than access, so it needs no hardware, and it makes players re-examine things they had written off as scenery.",
      "x": "A deciphered line reads KAMBR. The comb has been sitting in the bag since the first minute, apparently a keepsake.",
      "warn": "On its own it does not stop anyone simply examining every prop in the bag. Pair it with \"inert until named\" to close that gap.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "pointer"
    },
    {
      "c": "combine",
      "n": "Inert until named",
      "d": 2,
      "m": "Structural",
      "t": "prop useless without instruction decoration until told third entry",
      "w": "The prop a pointer sends you to carries no usable information until a second clue supplies the rule for reading it. Handling it early gains nothing, which is what makes a lockless chain hold.",
      "x": "The passport has twelve entry stamps and reads as travel decoration. \"The third entry\" turns it into a date. Without that line there is no way to know which stamp matters.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "inert-until-named"
    },
    {
      "c": "combine",
      "n": "Rule and data split",
      "d": 2,
      "m": "Structural",
      "t": "one clue holds information another holds instruction two objects together",
      "w": "One clue carries the information and a different one carries the instruction for reading it. Neither is a puzzle alone, so the combination is forced without anyone being told to combine anything.",
      "x": "The luggage tags hold the four digits; postcard 01 says which tag reads first. Our house standard, and the cheapest way to make two objects need each other.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "rule-and-data-split"
    },
    {
      "c": "combine",
      "n": "Instrument",
      "d": 2,
      "m": "Two props",
      "t": "prop acts on prop tool overlay filter comb applied to",
      "w": "One object does something to another: a grille over a message, a filter over a page, a rod for a wrapped strip. The aha is realising an object is a tool rather than a souvenir.",
      "x": "The comb laid across a card exposes one word per broken tooth. The same comb later measures a distance on a map.",
      "s": [
        "Cardan grille",
        "https://en.wikipedia.org/wiki/Cardan_grille"
      ],
      "id": "instrument"
    },
    {
      "c": "combine",
      "n": "Selection and order split",
      "d": 3,
      "m": "Structural",
      "t": "which items what sequence two rules arrangement narrow then sort",
      "w": "One clue says which items matter, another says what order they go in. Two trivial statements that together specify one arrangement out of thousands.",
      "x": "\"The four she posted from islands\" plus \"earliest to latest\" picks and sequences four cards from eighteen. Either clue alone is useless.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "selection-and-order-split"
    },
    {
      "c": "combine",
      "n": "Transformation chain",
      "d": 4,
      "m": "Structural",
      "t": "output becomes input keyword feeds next cipher cascade",
      "w": "The answer to one puzzle is the input to the next rather than a pointer to it — a word becomes a cipher keyword, a number becomes a grid row or a shift value.",
      "x": "A five-letter answer becomes the keyword that decodes the next card.",
      "warn": "Fails hard and silently: a wrong answer upstream breaks everything below it with no signal. Use only where the first step is self-verifying.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "transformation-chain"
    },
    {
      "c": "combine",
      "n": "Accumulator",
      "d": 2,
      "m": "Structural",
      "t": "one letter per puzzle collect over time partial progress visible",
      "w": "Each step yields one character or digit of a longer final answer, gathered across the whole game. Progress stays visible, and the final assembly costs nothing to design.",
      "x": "Eight puzzles, eight letters, one word at the end — and the blanks are printed somewhere from the start so players know they are collecting.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "accumulator"
    },
    {
      "c": "combine",
      "n": "Convergence",
      "d": 3,
      "m": "Structural",
      "t": "several chains feed one gate independent threads merge",
      "w": "Two or more independent chains that only meet at a final gate. Groups can split up, and nobody is blocked behind anyone else.",
      "x": "Each trail is its own short chain; all four converge on the map finale.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "convergence"
    },
    {
      "c": "combine",
      "n": "Burst structure",
      "d": 2,
      "m": "Structural",
      "t": "lock releases props then pointer chain then next code pacing hardware budget",
      "w": "A lock opens a compartment releasing three or four props; those play out as a pointer-and-instrument chain among themselves with no hardware at all; the last step produces the code for the next lock.",
      "x": "Eight locks and roughly thirty solving moments on a single padlock budget. The shape we are aiming at for the Norse bag.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "burst-structure"
    },
    {
      "c": "combine",
      "n": "One digit per prop",
      "d": 1,
      "m": "Several props, one lock",
      "t": "four objects four digits split the code across items",
      "w": "A four-digit code with each digit carried by a different object. The most obvious way to make one lock need four props.",
      "x": "Four postcards, one digit hidden in each Fun Fact block.",
      "warn": "The easiest multi-prop lock to get wrong. If three digits can be found and the fourth guessed, it is not a puzzle — make every digit cost real work, or use a lock with more dials than you have props.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "one-digit-per-prop"
    },
    {
      "c": "combine",
      "n": "Composite key",
      "d": 3,
      "m": "Several props, one lock",
      "t": "different kinds of answer letter number direction assembled mixed format",
      "w": "Each prop yields a different kind of information — a letter, a number, a direction, a colour — assembled into one multi-format answer. Harder to brute-force than four digits because the answer space is irregular.",
      "x": "A word lock whose five letters come from five completely different techniques, so no single insight unlocks the whole thing.",
      "s": [
        "Escape Room Games (Wiemker et al.)",
        "https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf"
      ],
      "id": "composite-key"
    },
    {
      "c": "combine",
      "n": "Attribute triangulation",
      "d": 3,
      "m": "Several props, one lock",
      "t": "each source one feature only one candidate matches all three",
      "w": "Every prop supplies one attribute, and exactly one candidate satisfies all of them. Self-verifying, because a wrong reading leaves zero matches rather than one.",
      "x": "A birth year from a letter, a departure year from a passenger list, a brooch motif from a photo caption. Only one ancestor fits all three.",
      "s": [
        "Logic puzzle",
        "https://en.wikipedia.org/wiki/Logic_puzzle"
      ],
      "id": "attribute-triangulation"
    },
    {
      "c": "combine",
      "n": "Sequential narrowing",
      "d": 3,
      "m": "Several props, one lock",
      "t": "each clue eliminates candidates order independent parallel filtering",
      "w": "Each prop rules out some of the candidates, in any order, until one remains. Order-independent, which means several players can work different props simultaneously.",
      "x": "Eighteen cards reduced to one by three independent facts, each on a different prop. Whoever finds a prop first can apply it immediately.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "sequential-narrowing"
    },
    {
      "c": "combine",
      "n": "Set completion",
      "d": 3,
      "m": "Several props, one lock",
      "t": "missing member incomplete collection what is absent gap",
      "w": "A set that ought to be complete is not, and what is absent is the answer. Needs the whole set present for the gap to be visible.",
      "x": "Nine stamps and eight destinations. The unmatched stamp names the next container.",
      "s": [
        "Set (mathematics)",
        "https://en.wikipedia.org/wiki/Set_(mathematics)"
      ],
      "id": "set-completion"
    },
    {
      "c": "combine",
      "n": "Modifier prop",
      "d": 3,
      "m": "Two props",
      "t": "changes how another is read inverts reverses transforms not data",
      "w": "A prop that carries no data at all — it changes how a different prop is read. Reverse it, invert it, turn it upside down, use the other side.",
      "x": "A card noting that she \"never could draw north the right way up\" is the only warning that one of the four maps is rotated.",
      "s": [
        "Thinking About A Puzzle",
        "https://puzzles.mit.edu/resources/thinkingaboutpuzzles.html"
      ],
      "id": "modifier-prop"
    },
    {
      "c": "combine",
      "n": "Multi-layer superposition",
      "d": 4,
      "m": "Three or more printed sheets",
      "t": "stack three transparencies align layers each contributes part",
      "w": "Three or more sheets stacked, each carrying part of a mark that is meaningless alone. Physically dramatic, and impossible to solve with fewer than all the layers.",
      "x": "Three postcards held together against a lamp complete a figure that two of them cannot even hint at.",
      "warn": "Registration gets harder with every layer. Give a printed alignment feature — a border, a corner cut, a punched hole — not a guessed position.",
      "s": [
        "Lithophane",
        "https://en.wikipedia.org/wiki/Lithophane"
      ],
      "id": "multi-layer-superposition"
    },
    {
      "c": "combine",
      "n": "Distributed jigsaw",
      "d": 2,
      "m": "One document, several containers",
      "t": "pieces spread across compartments late assembly torn letter",
      "w": "One document torn into pieces and distributed across containers opened at different times, so it cannot be completed until late regardless of how clever players are.",
      "x": "A letter in six pieces across three compartments. Holding five of them is visibly not enough, which is its own form of pacing.",
      "s": [
        "Jigsaw puzzle",
        "https://en.wikipedia.org/wiki/Jigsaw_puzzle"
      ],
      "id": "distributed-jigsaw"
    },
    {
      "c": "combine",
      "n": "External ordering",
      "d": 2,
      "m": "Several props plus one instrument",
      "t": "the props carry no order something else supplies it weigh sort date",
      "w": "Several props carry data but no sequence; a separate object or fact supplies the order. Splits one answer across two entirely different kinds of work.",
      "x": "Three cards carry three digits and nothing says which comes first. Weighing three coins on the balance gives the order.",
      "s": [
        "Balance puzzle",
        "https://en.wikipedia.org/wiki/Balance_puzzle"
      ],
      "id": "external-ordering"
    },
    {
      "c": "combine",
      "n": "Parallel subtasks",
      "d": 2,
      "m": "Several props, one lock",
      "t": "split among players social divide and conquer everyone busy simultaneous",
      "w": "Three independent mini-puzzles feeding one code, designed so a group naturally splits up. Social design rather than difficulty design — it exists so nobody stands watching.",
      "x": "Three sealed envelopes handed out at once, each giving one digit of a three-digit lock.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "parallel-subtasks"
    },
    {
      "c": "combine",
      "n": "Validator pairing",
      "d": 2,
      "m": "Structural",
      "t": "second clue confirms the answer checksum self-check before trying lock",
      "w": "One clue produces the answer and a second, unrelated one confirms it. Lets players check themselves instead of testing guesses against a padlock.",
      "x": "\"All four add to nineteen.\" Anyone who derives 1972 can verify it before touching the lock, and anyone who derives 1927 knows immediately that something is wrong.",
      "s": [
        "Checksum",
        "https://en.wikipedia.org/wiki/Checksum"
      ],
      "id": "validator-pairing"
    },
    {
      "c": "combine",
      "n": "Two-stage gate",
      "d": 3,
      "m": "A lock plus a physical condition",
      "t": "code and key both required condition plus combination double",
      "w": "A container needing both a code and a physical condition — the right key, an aligned object, a piece placed correctly. Two different kinds of progress required at the same moment.",
      "x": "The compartment takes a four-digit code, but the lid only lifts once the king piece is on its corner square.",
      "warn": "Easy to make frustrating. Players must be able to tell which of the two halves they have not satisfied.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "two-stage-gate"
    },
    {
      "c": "structure",
      "n": "Linear chain",
      "d": 1,
      "m": "Structural",
      "t": "one after another sequence single path simple",
      "w": "Each puzzle opens the container holding the next. Easy to build, easy to test, and it guarantees everyone experiences everything in order.",
      "x": "The shape of the Hiking bag. Good for younger players and for a first game.",
      "warn": "One stuck group stops entirely. Needs a good hint route.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "linear-chain"
    },
    {
      "c": "structure",
      "n": "Open / parallel",
      "d": 2,
      "m": "Structural",
      "t": "several at once independent branching work in parallel",
      "w": "Several puzzles available simultaneously, feeding one gate. A group of four always has something to do, and players self-select into what suits them.",
      "x": "Three containers openable in any order, all three needed before the finale.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "open-parallel"
    },
    {
      "c": "structure",
      "n": "Multi-linear",
      "d": 3,
      "m": "Structural",
      "t": "several chains converge paths merge hybrid",
      "w": "Two or three independent chains that converge at a gate. The usual compromise: parallel enough to keep everyone busy, ordered enough to control pacing.",
      "x": "Each trail is its own short chain; the four converge on the map finale.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "multi-linear"
    },
    {
      "c": "structure",
      "n": "Metapuzzle",
      "d": 4,
      "m": "Structural",
      "t": "combine earlier answers finale gather components second use",
      "w": "A final puzzle whose inputs are the outputs of earlier ones. The best version gives every earlier object a second, unexpected job.",
      "x": "The eighteen postcards, used individually all game, turn out to be the map of the whole journey.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "metapuzzle"
    },
    {
      "c": "structure",
      "n": "Delayed-use clue",
      "d": 3,
      "m": "Structural",
      "t": "save this for later keep it comes back second job",
      "w": "Something handed over early that means nothing until much later. Teaches players to keep everything, and makes the later reveal feel earned.",
      "x": "A redirect clue that reads as a fortune-cookie line when found and as a precise instruction three locks later.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "delayed-use-clue"
    },
    {
      "c": "structure",
      "n": "Progressive prop reveal",
      "d": 2,
      "m": "Structural",
      "t": "drip feed hand out one at a time not all at once disguise",
      "w": "Releasing a set of objects one at a time rather than all at once, so their collective purpose is not visible until the end.",
      "x": "Maps handed over one per trail. Because each gets an unrelated job on arrival, nobody reads them as the endgame device.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "progressive-prop-reveal"
    },
    {
      "c": "structure",
      "n": "Prop reuse",
      "d": 2,
      "m": "Structural",
      "t": "same object several puzzles instrument not single-use",
      "w": "One object serving three or four puzzles. Cheaper, harder for players, and it changes how objects read: a tool rather than a token.",
      "x": "The comb: a grille on one card, a measuring unit on a map, and the answer to a word lock.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "prop-reuse"
    },
    {
      "c": "structure",
      "n": "The redirect clue",
      "d": 2,
      "m": "Structural",
      "t": "answer is an instruction not a number breaks the pattern",
      "w": "A puzzle whose answer is a sentence rather than a code. It breaks the assumption that everything resolves to digits, and it re-points attention.",
      "x": "WEIGH WHAT SHE TRADED — no lock opens, but the balance suddenly has a purpose.",
      "s": [
        "How to Hunt Puzzles",
        "https://puzzles.mit.edu/resources/hth2023/hth2023.html"
      ],
      "id": "the-redirect-clue"
    },
    {
      "c": "structure",
      "n": "Hint ladder",
      "d": 1,
      "m": "Structural, plus a delivery method",
      "t": "three rungs nudge name give answer stuck help",
      "w": "Write escalating hints at design time: point toward the material, explain the connection, then show the solving steps. Keep the final answer available separately. Check that each step is supported by information inside the game.",
      "x": "Delivered as scratch-off panels, sealed envelopes, or a phone number to text.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "hint-ladder"
    },
    {
      "c": "structure",
      "n": "Fail-soft answer space",
      "d": 3,
      "m": "Structural",
      "t": "wrong reading does not resolve ambiguity safety guessing",
      "w": "Design so a misreading produces no answer rather than a confident wrong one, and so brute force is slower than solving.",
      "x": "The board puzzle: an incorrect assumption yields eighteen candidate routes rather than one plausible wrong code.",
      "s": [
        "13 Rules for Puzzle Design",
        "https://thecodex.ca/13-rules-for-escape-room-puzzle-design/"
      ],
      "id": "fail-soft-answer-space"
    },
    {
      "c": "structure",
      "n": "Teaching puzzle",
      "d": 1,
      "m": "Structural",
      "t": "first puzzle tutorial establishes habit teaches the game",
      "w": "A deliberately light opener whose job is to install a habit players need later — flip things over, put cards together, read the small print.",
      "x": "The luggage tags: all the data is visible, and the only hidden thing is which order to read it in.",
      "s": [
        "Ask Why (Nicholson)",
        "https://scottnicholson.com/pubs/askwhy.pdf"
      ],
      "id": "teaching-puzzle"
    },
    {
      "c": "structure",
      "n": "Reset cost",
      "d": 1,
      "m": "Structural",
      "t": "reusable replay consumable spares rebuild between plays",
      "w": "Plan how the game returns to its starting state. Note consumables, replacement prints and marks left by players. Test repeated handling: some folds can be reused, while torn or permanently revealed clues may need replacing.",
      "x": "Our games are lent to friends, so every consumable needs a printed spare in the box.",
      "s": [
        "Peeking Behind the Locked Door",
        "https://scottnicholson.com/pubs/erfacwhite.pdf"
      ],
      "id": "reset-cost"
    }
  ]
};
