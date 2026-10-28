# Beyond the Signal — Android closed-test brief

Prepared 28 October 2026. **Recruitment draft: the Google Play test has not started.** We are waiting for a developer-account registration issue to be resolved. Confirm the start date only after the Play release and joining link are available.

## What we are testing

Beyond the Signal is a portrait sci-fi match-3 adventure with 200 levels across 10 story chapters. Solve puzzles to repair a spaceship, explore outposts and restore stations. English, Czech, German, French, Spanish and Brazilian Portuguese are available.

We need genuine Android playtesting and private, honest feedback. There is no requirement to like the game, leave a public review or award a particular rating. Payment, if agreed separately, is for testing work and reports, not public ratings or reviews. We cannot promise production approval by Google.

## Joining the Google Play closed test

The coordinator will supply the real opt-in and installation links when the test is ready. No live tester link exists yet; do not substitute the website URL or the standalone APK.

- Use the same Google account to join the test and install the app through Google Play.
- Remain opted in continuously for the full agreed test period, at least14 consecutive days. Do not leave and rejoin during that period.
- Keep the app available for testing and install test updates through Google Play. Tell the coordinator if joining, installing or updating fails.
- For this first recruitment round we are seeking adult Android testers, although the game also includes a local mode for younger players.
- Send feedback privately to **flambiz.cz@gmail.com** or through Google Play's private testing feedback. Do not send passwords, Google sign-in codes, session tokens or payment details.

## Test sessions

Please play several sessions during the test period and try different features. The suggested schedule below is our QA plan, not a Google rule about daily minutes. Report serious issues immediately rather than waiting for a scheduled report. We are interested in genuine use, not repetitive launches solely to create activity.

| Stage | What to try | What to report |
|---|---|---|
| First session | Install from Play; launch; language and age choice; play the opening for roughly15–20 minutes | Phone model, Android version, game version, joining/install issues, first confusing task |
| Early sessions | Learn charges, covers, resonators and helpers as they appear | Controls, explanations, move limits, difficulty, text/layout problems |
| Saving | Close/reopen the app; as an adult optionally sign in with Google and compare the same account's web progress | Missing/reverted progress, error text, time waited for save status; no need to share credentials |
| Local mode | After saving and leaving a puzzle, choose 'Prefer not to say' in Age settings; close/reopen | No Google sign-in/ad/statistics controls; local guest progress can differ from account progress; account is not deleted |
| Optional rewards | In adult mode only, try a demo rewarded ad where offered; dismiss one and finish one | Reward only after a completed rewarded view; no lost puzzle or duplicate reward; unavailable ads should leave the game usable |
| Update | Install a test update from Play over the existing app | Saved progress remains; do not uninstall to update |
| Later sessions | Continue through available chapters and replay completed puzzles | Navigation, missing tasks, story transitions, poor difficulty spikes, long-session slowdowns |
| Final report | Summarize the period honestly | Last level reached, time played estimate, top 3 problems, strongest reason to continue or stop |

You do not have to finish all 200 levels. Never reset or delete an account to test progress preservation. Account-deletion QA uses a separately designated disposable account with the owner's approval.

## Bug report template

- Tester code:
- Phone model / Android version:
- Game language / app version:
- Last level, task or chapter:
- Mode: local / adult guest / adult signed in:
- What I did, step by step:
- Expected result:
- Actual result and error text:
- Can I reproduce it? Always / sometimes / once:
- Screenshot or short recording, with private information hidden:

For difficulty, add the level, attempts and which helpers/hints/extra moves/Undo you used. Do not compare assisted and unassisted wins as if they were the same.

## Important differences

The Play app uses package `com.playbeyondthesignal.game`. The existing development APK uses `.preview`; they have separate local storage. Cloud progress can be shared by signing into the same Google account. Energy and helper stock stay on each device/app installation. The website does not use the Android age screen.

The current build has **demo ads**, no real-money purchases and no requirement to buy helpers. Not seeing an ad in local mode is expected. Optional gameplay statistics can be refused; private feedback is still useful.
