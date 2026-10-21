# Flashcard sets

Tools: `list_flashcard_sets`, `get_flashcard_set`, `create_flashcard_set`, `update_flashcard_set`. Each card has a `term` and a `definition`, both plain text. A set holds up to 500 cards.

## Retrieval practice

- **One fact per card.** Split any definition that has "and" in it.
- **Make students recall, not recognize.** The front asks one specific thing, and the back gives a short answer that can be checked.
- **Write definitions in student words,** in 15 words or fewer at grade level. Add a short example when it helps: "Herbivore: an animal that eats only plants (a deer)."
- **Cover the unit in 10–25 cards** for most classes. Offer a second set rather than making one huge set.
- **Language sets:** set `term_language` and `definition_language` (for example `es-MX` and `en-US`) so read-aloud pronounces each side correctly.

## Speak mode

Speak is a study mode where students say each term aloud and SpartBoard checks their pronunciation. It works only when the terms are Spanish, German or English and the teacher's account has Speak. Offer it for world-language vocab; don't add it to content sets where the definition is the point.

Turn it on by passing a `speak` object. Leaving `speak` out keeps whatever the set already has, and the connector has no field that turns it off, so the teacher does that in SpartBoard.

- **`term_language`** must be the spoken language (`es-MX`, `es-ES`, `de-DE`, `en-US`), so the term side is the word students say and the definition side is the meaning.
- **`dialects`**: the accents to accept, from `es-419`, `es-ES`, `de-DE`, `en-US`. They must match the term language. Leave it out to accept every accent of that language, unless the teacher teaches one variety.
- **`level`**: `beginner` lets most hard sounds go, `intermediate` a few, `advanced` none. Match it to the course year: beginner for level 1, intermediate for levels 2–3, advanced for heritage speakers or AP.
- **`attempts`**: tries per card, 1–10.
- **`hear_it`**: shows a Hear it button that plays the word in the device's voice. Leave it on for beginners.

Put the level and attempts in the plan so the teacher can change them.

Write terms students can say: the word or short phrase alone. Keep notes, parentheses, slashes, "el/la" pairs, abbreviations and numerals out of the term; put a gender or usage note in the definition.

## Editing

`get_flashcard_set`, then `update_flashcard_set` with every card you're keeping, each with its `id`. Open Study assignments update right away; say so. On a Speak set, changed terms get new pronunciations, and any card SpartBoard wants checked waits for the teacher to review in SpartBoard; say so too.

## Hand-back checks to name

- definitions you simplified from the source
- any term with more than one common meaning
- on a Speak set: the level and attempts you chose, and any cards waiting for the teacher's pronunciation check
