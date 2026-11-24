---
name: ui-copy
description: "Write or fix the words in an interface so Paul doesn't reject them. Covers labels, menu items, hints, tooltips, toasts, errors, empty states, status words, dialog text and teacher-facing release notes. Use before adding or changing any on-screen string, when asked to write copy for something, when asked what a button or menu should say, or when Paul says a string is bad, confusing, slop or too technical. Built from real strings Paul rejected and the versions he approved. For long prose use deslop."
---

# UI copy

Every rule here comes from a string Paul rejected before it shipped and the version he approved. The cases are in `references/cases.md`. Read it the first time you use this skill in a session, because the before and after pairs teach the ear better than the rules do.

The reader is busy and mid-task. In Paul's apps that is usually a teacher running a class, or a student on a Chromebook. They read a string once, at a glance, and act on it.

## Before you write

1. **Find the project's word list.** Look for a copy section in the repo's `CLAUDE.md` files or a rule file such as `.claude/rules/ui-copy.md`. A noun Paul has already chosen is not yours to vary.
2. **Read the neighbors.** Open the screen or the file and see what the strings next to yours say. Match their words, casing and length.
3. **Ask whether the string is needed.** A line that repeats what the screen already shows gets deleted, not polished.

## The rules

### 1. One idea per sentence

This is Paul's most repeated rejection. He calls it AI slop.

- No "X, so Y". No "X, and Y, so Z". No "X because Y" where two sentences would do.
- Split it into short sentences, or cut the half the reader doesn't need.
- Three short sentences beat one long one.

> **No:** Not shared by district staff, so you can only import a copy.
> **Yes:** Only a copy can be imported.

> **No:** You left the page too many times, so it was submitted.
> **Yes:** You left the page too many times. Your assignment has been submitted. Ask your teacher if you think this was a mistake.

`deslop --writing` tells you to rejoin clauses with a conjunction. That is right for prose and wrong here. For on-screen strings this rule wins.

### 2. Say the outcome, never the mechanism

Say what happened and what to do next. Never say how the thing works underneath.

- Out: tabs and windows and how they connect, sessions, sync, hashes, renders, flags, switches, databases, file formats, issue trackers, the agent that will do the work.
- An error is two sentences at most. What failed, then what to do.

> **No:** Your SpartBoard tab is closed. Open View as from it and record again.
> **Yes:** This recording couldn't be saved. Keep your SpartBoard tab open and record again.

> **No:** Asks Claude to remove the switch and keep it as it is now.
> **Yes:** Remove the switch.

### 3. Short, but never vague

Short is not the goal. Clear is.

- A fragment with "it", "its", "this" or "that" pointing at something off-screen fails. Name the noun.
- A menu hint is 3 to 6 specific words that name where the thing goes or what happens.
- A longer full sentence beats a short riddle.

> **No:** Uses its settings.
> **Yes:** The settings for the existing assignment will be applied.

### 4. Use the reader's word

The code's word, the designer's word and the reader's word are often three different words. Use the reader's.

- The verb the user already uses for the action: teachers assign, they don't "pick".
- The standard term they already know: "Final score", not "Score that counts". "Category", not "criterion".
- A plain noun for a heading: "Import options", not "Ways in". Nothing cute, nothing metaphorical.
- One noun per concept across the whole app, in every locale. Once Paul picks it, never vary it for style.
- Never turn a feature name into a place or a thing. A student is on "the page" doing "your assignment", not in "the check".

### 5. A status word is a promise

Check what the word implies against the actual state.

- "Missing" says the work can still be turned in. Work that can no longer be turned in is "Not submitted".
- A neutral fact gets a neutral label and a neutral color. A second screen alone is "Device details", not "Unusual input".
- If two states need different actions from the reader, they need different words.

### 6. Show the specifics, not a count

- Don't make the reader do math or go looking. "2 scheduled students keep their times" becomes the list of students with their dates and times.
- Name the reassurance in plain words: "is saved".
- A warning that doesn't say what to do is noise. Put the signal on the control that fixes it, such as the button changing color with a tooltip, instead of adding a chip that only reports a problem.

### 7. Labels are bare

- A label or menu item is a conventional noun or a verb phrase. No examples, no asides. "Text", not "Text, like a word bank".
- No trailing "…" or "..." on a menu item or button, even when it opens a dialog.
- No vendor or model names. Use "AI" once where the reader needs to know and not in every label.
- Name the result, not the tool. "Generate questions", not "Generate with Gemini". "Finding a video…" as a progress line, not "Asking Gemini…".
- Fold a counter into the control it belongs to: "Play audio (1/3)".
- Field labels are the thing itself: "Questions", not "Target Question Count".

### 8. When in doubt, delete it

- A count, caption or helper line that restates the list or control beside it goes.
- A heading that only announces the section ("AI Configuration") goes.
- Never draw explanatory notes on a mockup. Anything on a mockup reads as planned copy. Notes to Paul go in the message.

### 9. When Paul is confused, rewrite

If Paul says he doesn't understand a string, that is the verdict on the string. Don't explain what it meant. Reply with the rewritten string and nothing about the mechanism behind it. A second explanation makes it worse.

## Standing rules

These apply everywhere without discussion.

- Plain words. Under 30 words per string.
- No em dash. No semicolon. No "Tip:" or "Note:" prefixes.
- No marketing words and no exclamation marks.
- "Select", not "Choose".
- People's names in lists are "Last, First".
- Never tell a user to contact or visit the school office.
- A verb button can reuse a banned noun's root when it is the natural verb. "Try again" is fine where "tries" is banned.

## Release notes

Release notes are UI copy. Teachers read them, developers don't.

- Describe what the teacher sees or can now do.
- No flag names, access levels, "admin-only" lines, paths, "renders", "hashes" or any internal name.
- Check every claim against what the settings actually enable, not what the code defines.
- Rule 1 applies here too.

> **No:** Translations ride the public question through the same shuffle.
> **Yes:** Answer choices are shuffled into the same order in every language.

## The check before you show Paul

Run every new or changed string through this list. Fix it yourself. Don't ask Paul to choose between a slop version and a clean one.

1. Is there a comma followed by "so", "and", "but", "which" or "because"? Split or cut.
2. Does it mention how anything works? Cut that part.
3. Does "it", "its", "this" or "that" point at something the reader can't see in the same string? Name it.
4. Is every noun the one the project already uses for that thing?
5. Does the status word promise something that isn't true in this state?
6. Is there a count where names would fit?
7. Does a label have an example, an ellipsis, a vendor name or more than one idea?
8. Would the screen lose anything if this string were gone?
9. Read it out loud as the teacher, mid-class. Would a person say it?

Then show the strings as plain before and after pairs, with where each one appears on screen. No commentary on why the new one is better.

## When Paul rejects a string

1. Rewrite it at once. Use his wording exactly when he gives it, including his nouns.
2. Find every other place the same word or pattern appears and fix those in the same change.
3. Save the lesson where the next session will find it: the project's word list for a word choice, or a guard test when the repo has one and the rule is mechanical.
