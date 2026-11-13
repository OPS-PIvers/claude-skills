# Flashcard sets

Tools: `list_flashcard_sets`, `get_flashcard_set`, `create_flashcard_set`, `update_flashcard_set`. Each card has a `term` (up to 500 characters) and a `definition` (up to 1,000), both plain text with no images. A set holds 1–500 cards. Title up to 200 characters, `description` up to 1,000.

**Every card needs a definition.** The connector can't save a term-only card. For a sight-word or term-only list, give the teacher the words one per line to paste into the set editor in SpartBoard instead.

## Retrieval practice

- **One fact per card.** Split any definition that has "and" in it.
- **Make students recall, not recognize.** The front asks one specific thing, and the back gives a short answer that can be checked.
- **Write definitions in student words,** in 15 words or fewer at grade level. Add a short example when it helps: "Herbivore: an animal that eats only plants (a deer)."
- **Cover the unit in 10–25 cards** for most classes. Offer a second set rather than making one huge set.
- **Languages:** `term_language` and `definition_language` are read-aloud language tags (for example `es-MX` and `en-US`); both default to `en-US`. Set them on any world-language set so each side is pronounced correctly.

## Speak mode

Speak is a study mode where students say each term aloud and SpartBoard checks their pronunciation. It exists only when the teacher's account has Speak and the term language is Spanish, German or English (`es-*`, `de-*`, `en-*`). Then it's available on every such set, and the teacher turns it on or off, and can change its rules, when assigning. Offer it for world-language vocab; don't promote it on content sets where the definition is the point.

The optional `speak` object sets the set's own Speak rules; without it the set uses the district defaults. Leaving `speak` out of an update keeps what the set has. Nothing in the connector removes a set's own rules.

- **`term_language`** must be the spoken language, so the term side is the word students say and the definition side is the meaning.
- **`dialects`**: accents to accept. Only Spanish has a choice (`es-419`, `es-ES`); German is `de-DE` and English `en-US`. They must match the term language. Leave it out to accept all, unless the teacher teaches one variety.
- **`level`**: `beginner` lets most hard sounds go, `intermediate` a few, `advanced` none. Match it to the course year: beginner for level 1, intermediate for levels 2–3, advanced for heritage speakers or AP.
- **`attempts`**: tries per card, 1–10.
- **`hear_it`**: shows a Hear it button that plays the word in the device's voice. Leave it on for beginners.

Put the level and attempts in the plan so the teacher can change them.

Write terms students can say: the word or short phrase alone. Keep notes, parentheses, slashes, "el/la" pairs, abbreviations and numerals out of the term; put a gender or usage note in the definition.

Refusals: "Speak works when the term language is Spanish, German or English" (fix `term_language` or drop `speak`); "Speak is not turned on for this account" (drop `speak` and tell the teacher Speak isn't available for them yet).

**Save results:** when Speak applies, the result has `speak.cards_ready`, `cards_to_check` and `cards_unavailable`. If `cards_to_check` is above 0, tell the teacher to check those cards in the set editor in SpartBoard before students are judged on them. `get_flashcard_set` shows each card's `speak_status` (`ready`, `needs-review`, `unavailable`) and the set's `speak` rules, where `preset` is the level and `example` is Hear it.

## Editing

`get_flashcard_set`, then `update_flashcard_set` with every card you're keeping, each with its `id` (a card without one is new and loses its study progress). Say what reached students:

- `open_study_assignments_updated`: open Study assignments now show the new cards.
- `open_checks_updated` (only some accounts): fixes to cards already in an open Check reached it and its submissions were re-scored. Added or removed cards, and swapped sides, don't change a Check.
- `warning`: some open assignments still show the old cards until the teacher re-saves the set in SpartBoard. Pass it on.

On a Speak set, a changed term gets a new pronunciation lookup, and may land in `cards_to_check`.

## Not available here

Term-only cards, images on cards, set-level learning targets, Check or Study results, and sharing or assigning. The teacher does these in SpartBoard.

## Hand-back checks to name

- definitions you simplified from the source
- any term with more than one common meaning
- on a Speak set: the level and attempts you chose, and any cards waiting for the teacher's pronunciation check
