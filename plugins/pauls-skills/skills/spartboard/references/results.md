# "How did my class do?"

Tools: `get_quiz_results_summary(quiz_id)`, `get_video_activity_results_summary(activity_id)` and `get_mini_app_results_summary(app_id)` (listed only when mini-app results are on for the teacher; without it, say mini-app results aren't available for them yet). Find the id with `list_quizzes`, `list_video_activities` or `list_mini_apps` and `search`. Results cover the teacher's own newest 5 assignments, or one assignment by `assignment_id`.

## What you get

- **Class-level numbers only:** completed responses, average percent, score bands, and for each question the percent correct and how many students picked each choice.
- **Mini-apps** report each student's best attempt: average, score bands, average attempts and percent correct per question. Questions marked `scored_by: app` were scored by the app itself, not SpartBoard. Assignments made before results scoring have no summary.
- **Hidden under 5 finishers.** Say so kindly if a summary is hidden.
- **You never see a student's name, answers or score.** Don't guess at individuals.

## Answer in this shape (short)

1. **Overall:** the average, and whether scores are bunched together or spread out, in one line.
2. **The 2–3 weakest questions:** the percent correct, and the most-picked wrong choice. For multiple-choice and choose-all questions, name the misconception behind that choice.
3. **One strength** worth keeping.
4. **Offer, but don't start,** a short reteach or follow-up quiz on the weak skills. If they say yes, run the normal plan step from `SKILL.md`.

## Care

- A low percent on one question can mean a flawed item. Check the key and the wording before blaming learning. If the item looks ambiguous, say so and offer to fix it.
- Don't draw conclusions about groups of students.
