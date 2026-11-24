# Rejected copy, then approved copy

Real strings from SpartBoard that Paul pushed back on before they shipped, with the version he approved. Collected 2026-11-24. Paul's words are quoted where they were captured, with the swearing trimmed. The number in brackets is the rule in `SKILL.md` each case supports.

## Sentences

### Compound sentence in a security message [1]
- **Before:** "Not shared by district staff, so you can only import a copy."
- **Paul:** "how many times do I have to say that this sentence structure is NOT good in UI"
- **After:** "Only a copy can be imported."

### Student lock-out message [1, 4]
- **Before:** Copy that called the assignment "the check" (earlier "the try"), ending "..., so it was submitted."
- **Paul:** "the check" is as bad as "the try". Compound sentences read as AI slop.
- **After:** "You left the page too many times. Your assignment has been submitted. Ask your teacher if you think this was a mistake."

### "Add to assignment" hint [3]
- **Before:** "Add to the Period 3 Math 7 assignment" with "Uses its settings." under it
- **Paul:** "the subtext "Uses its settings" is horrible. "The settings for the existing assignment will be applied.""
- **After:** "The settings for the existing assignment will be applied."

## Mechanism

### Menu hints that explained the machinery [2, 3]
- **Before, round 1:** "Moves it out of Previews with its settings" / "Asks Claude to remove the switch and keep it as it is now"
- **Before, round 2:** "Keep it as a switch with its settings." / "Ask Claude to delete the switch and keep it as it is now."
- **Paul:** "No that is horrible. Graduate is move to features or widget settings and retire is remove switch. Why in the world would the sub text need such dumb specific language"
- **After:** Graduate: "Move to Features or widget settings." Retire: "Remove the switch."

### Recording error that explained the tab chain [2, 9]
- **Before:** "Your SpartBoard tab is closed. Open View as from it and record again." Then, when Paul asked, a 4-step explanation of how the tabs connect.
- **Paul, first:** "I am pretty confused. Where does that message even show up?"
- **Paul, after the explanation:** "I told you I don't understand that message"
- **After:** "This recording couldn't be saved. Keep your SpartBoard tab open and record again."

### Release notes in developer language [2, release notes]
- **Before:** "Translations ride the public question through the same shuffle", "renders in it", "hash-fresh", plus flag and "admin-only" lines in teacher-facing notes
- **Paul:** "what even is that? No one talks like that. "Renders" is technical. ... We need to deslop that and make it less technical, more objective and concise user-friendly language."
- **After:** "opens in that language". "Editing a question marks its translation out of date and students keep seeing English until you review it." Flag lines removed.
- **Still wrong:** the merged note kept "answer choices are shuffled into the same order in every language, so a translated quiz never gives away which answer is correct". That is an "X, so Y" sentence and would be rejected today.

### AI panel wording [7]
- **Paul:** "remove the generic AI slop"
- **Before and after:** "Generate with Gemini" became "Generate questions". "Asking Gemini…" became "Finding a video…". "Target Question Count" became "Questions". The "AI Configuration" heading was removed. "AI-assist" and "Generate with AI" became "Draft with AI". "Generate Code" became "Draft app".

## Words

### "Picked student names" [4]
- **Before:** Label "Picked student names"
- **Paul:** "Assigned Students, not picked"
- **After:** "Assigned students"
- **Why:** teachers assign. "Picked" was the code's word for how targeting works.

### "Tries" and "takes" [4]
- **Before:** "tries", "takes", "Retakes" for repeated attempts
- **Paul:** "I *hate* referring to the attempts as "tries" or "takes"." It was the third time he had said it.
- **After:** "Attempts per card", "Attempt 2 of 3", "Play my attempt". The button "Try again" stays. A guard test now blocks the nouns.

### "Score that counts" [4]
- **Before:** "Score that counts", and "Retakes: Use latest / Use highest / Average them"
- **After:** "Final score: Latest / Highest / Average"

### "Ways in" [4]
- **Before:** Heading "Ways in"
- **After:** "Import options"

### Rubric grader [4]
- **Before:** "criterion", "Jump to next", "Open next"
- **After:** "category", "Auto-advance to next category", "Auto-open next category"

### Audio limit [4, 7]
- **Before:** "Play limit / plays remaining" and "views"
- **After:** "Replays" with Unlimited / None / 1 / 2 / 3, and one button "Play audio (N/M)"

### Smaller renames Paul made [4]
- "Drop or paste a file" became "Drag a file or paste an image"
- "Points awarded" became "Score"
- "Session settings" became "Assessment Settings"
- A meeting notes template's "Decisions" became "Discussion Notes"
- Picker titles say "Select a Google Slides File". The rule is "Select", not "Choose".
- A tooltip explaining "the score a flag gives a cell with no score" became "Unscored value"

## Status

### "Missing" on work that can't be turned in [5]
- **Before:** Expired student rows labelled "Missing" in red
- **Paul:** "Missing indicates it can still be completed, so the status needs to be changed to like "Not submitted""
- **After:** "Not submitted" in muted gray. "Missing · still open" stays for work that can still be done.

### A popover that read as an accusation [5]
- **Before:** A second screen alone showed as "Unusual input"
- **After:** A second screen alone shows a gray "Device details" badge. "Unusual input" stays for real signs.

## Specifics

### Close toast for scheduled students [6]
- **Before:** "Period 3 is closed. 2 scheduled students keep their times."
- **Paul:** "this is bad. "Period 3 is closed. Any student scheduled for later is saved. [list here of students and times they are scheduled, with this info clearly available in the Assigned tab corresponding row]"
- **After:** Title "Period 2 is closed", then "Any student scheduled for later is saved.", then each student as Last, First with date and time. The Assigned row reads "Closed · 2 students scheduled" with a "Scheduled for later" list.

### "Changed since publish" chip [6]
- **Before:** A "Changed since publish" status chip on each row
- **Paul:** it "doesn't tell people what to do"
- **After:** Chip removed. The "Check tour" button turns dark amber with a tooltip.

## Labels

### Ellipses in a menu [7]
- **Before:** "Published scores…", "Reopen…", "Share results with PLC…", "Publish settings...", "Score visibility..."
- **Paul:** "Stop with the dumb ellipses. Why would that be in a menu?"
- **After:** "Publish scores", "Share results with PLC", "Reopen", "Close for all classes", "Move to Finished", "Delete"

### Menu items with examples [7]
- **Before:** "Text, like a word bank"
- **After:** "Text" / "Link" / "Drive file"

## Deletions

### "N not joined" [8]
- **Before:** A count line "N not joined" under "Not started"
- **Paul:** "really stupid"
- **After:** Removed. "N absent" shows only when above zero.

### Caption inside a mockup [8]
- **Before:** A note drawn inside a mocked editor: "Students see 'Choose all that apply' under the question, as they do today"
- **Paul:** "completely unnecessary copy hard coded into the UI"
- **After:** Removed. Notes to Paul go in the message.
