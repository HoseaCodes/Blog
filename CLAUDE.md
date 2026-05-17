# Debugging protocol for this repo

When the user reports any symptom ("it doesn't work", "buttons don't click", "page is blank",
"shows wrong data"), do NOT propose a fix in your first response. Run this loop:

## 1. Observe before hypothesizing

Ask for or read these BEFORE writing any code:

- **Full console output** (errors AND warnings, since the user opened DevTools)
- **DOM snapshot at the failure point**: ask the user to inspect-element on the misbehaving
  region and share the parent chain. Cheaper than 5 wrong fixes.
- **Reproduction steps**: exact sequence, including page URL and any prior interactions.

## 2. Never dismiss adjacent errors

If the console shows ANY error within ~30s of the symptom, treat it as a suspect until
proven unrelated. Specifically:

- Errors mentioning `iframe`, `process`, `webpack`, `runtime` are almost always
  dev-tool injections (LocatorJS, React DevTools overlay, Sentry replay, etc.).
- A full-viewport `<iframe>` in `<body>` with high z-index = dev tool eating events.
  Always inspect `<body>`'s direct children when clicks misbehave.

## 3. Instrument before fixing

The first change you ship for an unfamiliar bug should be observation, not a fix:

- Mount-time `console.log` with a version stamp so we can confirm new code is loaded
  (hot-reload + `React.lazy` + styled-components hot-swap is famously flaky).
- Capture-phase `document.addEventListener` for click/keydown bugs.
- `ref` on the suspect element + log its `getBoundingClientRect()`, computed style,
  and parent chain at mount.

Only after data confirms a hypothesis, write the real fix.

## 4. One hypothesis per round

If a fix doesn't resolve the bug on the next test, DO NOT bolt on a second fix.
Roll back or instrument; do not stack guesses. Stacked guesses make root-causing
harder, not easier.

## 5. State the hypothesis out loud

Before shipping a fix, write a one-line "I believe X is causing Y because Z, and
the fix will be verified by W." If you can't finish that sentence, you're guessing.

## Frontend UI bug checklist (run top to bottom)

1. Is the new code actually loaded? (Mount log fires? Version stamp matches?)
2. What's the topmost element at the cursor coordinates? (DevTools "Inspect Element")
3. Is there a full-viewport iframe or div in `<body>` above your target's z-index?
4. Pointer-events chain: walk ancestor chain in DevTools, look for `pointer-events: none`.
5. Visibility/display chain: any ancestor with `visibility: hidden` or `display: none`?
6. Capture-phase listeners on `document`/`window` calling `stopImmediatePropagation`?
7. Browser extension content scripts? (Try incognito with extensions off.)

## When you fail to follow this

Acknowledge it explicitly: "I skipped step N. Re-running it now." Don't pretend the
shortcut was the path.
