# Flashcard sets

Tools: `list_flashcard_sets`, `get_flashcard_set`, `create_flashcard_set`, `update_flashcard_set`. Each card has a `term` and a `definition`, both plain text. A set holds up to 500 cards.

## Retrieval practice

- **One fact per card.** Split any definition that has "and" in it.
- **Make students recall, not recognize.** The front asks one specific thing, and the back gives a short answer that can be checked.
- **Write definitions in student words,** in 15 words or fewer at grade level. Add a short example when it helps: "Herbivore: an animal that eats only plants (a deer)."
- **Cover the unit in 10–25 cards** for most classes. Offer a second set rather than making one huge set.
- **Language sets:** set `term_language` and `definition_language` (for example `es-MX` and `en-US`) so read-aloud pronounces each side correctly.

## Editing

`get_flashcard_set`, then `update_flashcard_set` with every card you're keeping, each with its `id`. Open Study assignments update right away; say so.

## Hand-back checks to name

- definitions you simplified from the source
- any term with more than one common meaning
