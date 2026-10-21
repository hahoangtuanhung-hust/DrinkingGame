# After Hours — Immersive Party Games

A production-oriented, mobile-first React app with two persistent tabletop experiences: a 3D five-dice shaker and a complete 52-card rule game.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. A modern browser with WebGL is recommended for the dice scene.

## Quality checks

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Architecture

- `src/app` — route composition, shared settings, and persisted experience controls.
- `src/features/cards` — standard deck generator, secure Fisher–Yates shuffle, rule-resolution engine, persisted store, card visuals, and swipe interaction.
- `src/features/dice` — explicit state machine, secure one-shot result generation, device-motion hook, persisted store, and the lazy-loaded React Three Fiber scene.
- `src/lib` — Web Audio synthesis, cryptographic random helpers, and guarded LocalStorage access.
- `src/tests` and `e2e` — engine/component unit tests and browser flow coverage.

Zustand stores keep game logic separate from animation. A card draw advances the pointer and snapshots its rule atomically before animation begins. A dice shake generates its five values exactly once on the valid `SHAKING` transition; later animation stages never regenerate them.

## Randomization correctness

`crypto.getRandomValues` is sampled with rejection to avoid modulo bias. Cards use Fisher–Yates with that source. Dice use the same unbiased integer generator and expose dependency-injected random functions only at the pure engine layer for deterministic tests.

## 3D and performance

The dice scene uses reusable rounded geometry, procedural pips, bounded device pixel ratio, quality-based shadow settings, route-level loading, and demand rendering while idle. The cup's lid position is driven by the state-machine peek amount and never mutates results. Reduced-motion mode suppresses the scene shake and light pulse.

## Persistence and recovery

Settings, deck order, pointer, draw history/rule snapshots, custom rules, dice values, and shake progress are stored with schema validation and version numbers. Corrupt or internally inconsistent card sessions are discarded safely rather than partially restored.

## Browser notes

- Device motion permission is opt-in and primarily required by iOS Safari.
- Vibration is used only where `navigator.vibrate` is available.
- Sounds are synthesized after user input, so no audio autoplays.
- The “flash” is a WebGL light pulse; the app never requests physical flashlight access.
- LocalStorage and advanced device APIs are progressive enhancements; button controls remain available.

## Responsible play

All prompts are optional and intentionally lightweight. Water, soda, mocktails, snacks, or a pass are valid alternatives. Never drink and drive.
