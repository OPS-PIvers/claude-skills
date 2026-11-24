# Rejected copy, then approved copy

Real strings from SpartBoard that Paul rejected before they shipped, with the version he approved. Grouped by the rule in `SKILL.md` each one supports. A "Why" line appears only where the pair doesn't show the reason by itself.

## 1. One idea per sentence

| Before | After |
|---|---|
| Not shared by district staff, so you can only import a copy. | Only a copy can be imported. |
| A lock-out message ending "..., so it was submitted." | You left the page too many times. Your assignment has been submitted. Ask your teacher if you think this was a mistake. |

## 2. Say the outcome, never the mechanism

| Before | After |
|---|---|
| Moves it out of Previews with its settings | Move to Features or widget settings. |
| Asks Claude to remove the switch and keep it as it is now | Remove the switch. |
| Your SpartBoard tab is closed. Open View as from it and record again. | This recording couldn't be saved. Keep your SpartBoard tab open and record again. |
| Translations ride the public question through the same shuffle | Answer choices are shuffled into the same order in every language. |
| renders in it | opens in that language |
| "hash-fresh", flag names and "admin-only" lines in release notes | Removed. "Editing a question marks its translation out of date." |

**Why:** the menu hints went through two rejected rounds because the second round only reworded the mechanics ("Ask Claude to delete the switch"). The fix was to drop them.

## 3. Short, but never vague

| Before | After |
|---|---|
| Uses its settings. | The settings for the existing assignment will be applied. |

**Why:** the longer version won. "Its" pointed at something the reader had to work out.

## 4. Use the reader's word

| Before | After |
|---|---|
| Picked student names | Assigned students |
| tries, takes, Retakes | Attempts per card, Attempt 2 of 3, Play my attempt |
| Score that counts | Final score |
| Retakes: Use latest / Use highest / Average them | Final score: Latest / Highest / Average |
| criterion | category |
| Jump to next, Open next | Auto-advance to next category, Auto-open next category |
| Play limit, plays remaining, views | Replays |
| Ways in | Import options |
| Points awarded | Score |
| Session settings | Assessment Settings |
| Decisions (meeting notes heading) | Discussion Notes |
| Drop or paste a file | Drag a file or paste an image |
| Choose a file | Select a Google Slides File |
| "the check", "the try" (a student's assignment) | "your assignment", on "the page" |
| A tooltip explaining "the score a flag gives a cell with no score" | Unscored value |

**Why:** "picked" was the code's word for how targeting works. Teachers assign. "Tries" was rejected three times before a guard test blocked it. The button "Try again" stays.

## 5. A status word is a promise

| Before | After |
|---|---|
| "Missing" in red, on work that can no longer be turned in | "Not submitted" in muted gray |
| "Unusual input", for a second screen alone | "Device details" in gray |

**Why:** "Missing" tells the reader the work can still be done, so it stays as "Missing · still open" for work that can. "Unusual input" reads as an accusation, so it stays only for real signs.

## 6. Show the specifics, not a count

| Before | After |
|---|---|
| Period 3 is closed. 2 scheduled students keep their times. | Title "Period 3 is closed". Then "Any student scheduled for later is saved." Then each student as Last, First with date and time. |
| A "Changed since publish" chip on each row | Chip removed. The "Check tour" button turns dark amber with a tooltip. |

**Why:** the chip reported a problem without saying what to do. The signal moved to the control that fixes it.

## 7. Labels are bare

| Before | After |
|---|---|
| Published scores…, Reopen…, Share results with PLC… | Publish scores, Reopen, Share results with PLC |
| Text, like a word bank | Text |
| Generate with Gemini | Generate questions |
| Asking Gemini… | Finding a video… |
| Target Question Count | Questions |
| AI-assist, Generate with AI | Draft with AI |
| Generate Code | Draft app |
| "Play limit" plus a separate "plays remaining" line | One button: Play audio (N/M) |

## 8. When in doubt, delete it

| Before | After |
|---|---|
| "N not joined" under "Not started" | Removed. "N absent" shows only when above zero. |
| "AI Configuration" heading | Removed |
| A note drawn inside a mockup: "Students see 'Choose all that apply' under the question, as they do today" | Removed. Notes to Paul go in the message. |

## 9. When Paul is confused, rewrite

The recording error in rule 2 was rejected twice. The first time Paul said he was confused by it. The reply was a 4-step explanation of how the tabs connect, which he rejected harder. The rewrite was what he wanted the first time.

## Still wrong in the shipped app

One merged release note kept "answer choices are shuffled into the same order in every language, so a translated quiz never gives away which answer is correct". That is an "X, so Y" sentence and would be rejected today. Don't copy it.
