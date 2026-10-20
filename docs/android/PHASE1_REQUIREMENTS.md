# Ibadah Tracker for Android — Phase 1 Requirements

**Author:** Quantum (QA / Docs) · **Status:** Decisions settled — awaiting CEO approval · **Date:** 20-Oct-2026
**Builder:** Dave · **Approver:** Farrukh (CEO) — nothing merges to `main` without explicit approval.

---

## 1. Goal

Ship the existing web app (`index.html`, v2.0) as an installable Android app for phones and tablets, without forking the code. Same features, same Firebase project, same data. The web version on GitHub Pages must keep working exactly as today.

## 2. Ground rules

| # | Rule |
|---|------|
| G1 | **One source of truth.** `index.html` stays the single app file and keeps working when opened from GitHub Pages or double-clicked locally. The Android project wraps it; it does not copy and diverge from it. |
| G2 | **Merging to `main` is a live release of the website.** GitHub Pages serves `main`, so every Android PR must also pass the web regression checklist (§8.1) before it is offered for approval. |
| G3 | Dave works on branch `android/phase1` and opens a PR. Small PRs are welcome (e.g. offline libs first, then Capacitor, then CI), each approved separately. |
| G4 | No behaviour changes to tracking logic, data format or Firestore structure in Phase 1. |

## 3. Current state (what Dave is starting from)

- Single file, ~53 KB, no build step.
- Loaded from the internet at runtime:
  - Tailwind CSS v4 browser build (`cdn.jsdelivr.net/npm/@tailwindcss/browser@4`) — compiles CSS in the browser on every load.
  - Chart.js (`cdn.jsdelivr.net/npm/chart.js`) — **unpinned**, always the latest version.
  - chartjs-plugin-datalabels v2.
  - Firebase 10.8.0 (app, auth, firestore) as ES modules from `gstatic.com`.
- Auth: Firebase email/password only (no Google pop-up) — good news, this works inside an app WebView without native plugins.
- Firestore with persistent offline cache (IndexedDB); per-day `updateDoc` writes; `visibilitychange` + `online` trigger a server refresh.
- Backup export uses an `<a download>` link; restore uses `<input type="file">` + `FileReader`.
- Layout: Tailwind `lg:` (≥1024 px) switches to the 2-column dashboard; below that everything stacks in one column.

## 4. Functional requirements

### R1 — Offline bundled libraries
- R1.1 All four libraries are stored in the repo (e.g. `vendor/`) and loaded by relative path. No runtime requests to jsdelivr or gstatic.
- R1.2 Versions are **pinned** and recorded in `vendor/VERSIONS.md` (name, version, source URL, date). Chart.js is pinned to the version the live site is currently getting, so charts look the same.
- R1.3 Firebase stays on **10.8.0** in Phase 1 (upgrade is a separate change). The gstatic modules import each other by absolute URL, so they must be bundled into a local module (e.g. npm `firebase@10.8.0` + esbuild → `vendor/firebase.js`), not just downloaded.
- R1.4 Tailwind: either vendor the pinned browser build, or generate a static CSS file at build time. Dave picks; the PR must state which and why. Acceptance is the same either way: no visual difference and no unstyled flash on start-up.
- R1.5 The website on GitHub Pages uses the same vendored files (G1).

### R2 — Capacitor Android wrapper
- R2.1 Current stable Capacitor release; Android platform only.
- R2.2 Web assets are copied from the repo root into the Capacitor web dir by a script — `index.html` is never hand-copied.
- R2.3 App ID and app name per decisions D1/D2.
- R2.4 Android back button: if the date picker or a dialog is open, close it; otherwise exit the app (no blank screen, no crash).
- R2.5 `confirm()` / `alert()` dialogs (Reset, sign-in messages) must appear as native dialogs and return the right answer.
- R2.6 Status bar and navigation bar must not cover content (Android 15+ draws apps edge-to-edge): apply safe-area insets.
- R2.7 Foreground refresh still fires when returning to the app (verify `visibilitychange` in the WebView; add Capacitor `App` `resume` as a backup if needed).

### R3 — Firebase sign-in and sync
- R3.1 Register, log in, log out work in the app with the existing Firebase project `ibadah-tracker-5fa66`.
- R3.2 User stays signed in after closing and reopening the app and after a phone restart.
- R3.3 Real-time sync phone ⇄ laptop in both directions (same as today).
- R3.4 Offline: entries made in airplane mode are kept after the app is closed and upload when the connection returns; status shows *Offline* → *Saving…* → *Saved ✓*.
- R3.5 Check the Firebase API key restrictions in Google Cloud Console: if the key is restricted by HTTP referrer, the app origin (`https://localhost`) must be allowed. Email/password sign-in does not need an "authorized domain" entry.
- R3.6 Note for users (README): local-mode data in the phone's browser is **not** the same storage as the app. To move it, sign in, or use Backup → Restore.

### R4 — Backup and restore on Android
- R4.1 "Download Backup File" must actually produce a file on Android. The `<a download>` link does nothing in a WebView, so in the app it uses Capacitor Filesystem + Share (user can save to Files/Drive or send on WhatsApp). The web keeps the current download.
- R4.2 "Restore from Backup File" opens the Android file picker and restores a backup made on the web or the app.

### R5 — Tablet and phone layout
- R5.1 Tablet portrait (≈768–1023 px wide) uses a 2-column layout instead of one long column.
- R5.2 Tablet landscape keeps the current 3-column `lg:` layout.
- R5.3 Touch targets at least 48 dp: prayer buttons, date arrows, batch buttons, checkboxes.
- R5.4 Chart is taller on tablets (current fixed 256 px is small on a 10" screen) and redraws correctly on rotation.
- R5.5 Phone (360–430 px wide): no horizontal scrolling; the five prayer buttons and the legend fit on one row; the sign-in form is usable with the keyboard open.
- R5.6 Rotation allowed on phone and tablet; data entered is not lost on rotation.
- R5.7 Wording: "Click 1/2/3" legend reads naturally on touch ("Tap"). Text-only change, applies to web too.
- R5.8 Desktop web layout (≥1024 px) is unchanged.

### R6 — Icon and splash screen
- R6.1 Adaptive launcher icon (foreground + background layers) plus legacy and round icons, generated from one source image kept in `resources/` (e.g. with `@capacitor/assets`).
- R6.2 Splash screen using the Android 12+ splash API, emerald brand colour (`#047857`, matches the header), icon centred; no white flash before the app paints.
- R6.3 Artwork per decision D4.

### R7 — Build on GitHub Actions
- R7.1 Workflow `android.yml` runs on pushes to `android/**` branches and on PRs to `main`: installs deps, bundles libs, syncs Capacitor, builds a **debug APK** and uploads it as a workflow artifact.
- R7.2 On a version tag (`v2.1.0` etc.) it builds a **signed release APK** and attaches it to a GitHub Release. versionName from the tag, versionCode from the run number (always increasing).
- R7.3 Signing keystore is stored only in GitHub Secrets (never committed). Without a stable keystore every build has a different signature, and Android refuses to install an update over the previous version — users would have to uninstall and lose local-mode data.
- R7.4 Building never deploys anything and never merges anything (CEO decides releases).
- R7.5 Build time target: under 10 minutes; Gradle and npm caches enabled.

## 5. Non-functional

- N1 App starts and shows today's entry in under 3 seconds on a mid-range phone, online or offline.
- N2 APK size target: under 15 MB.
- N3 Zero network requests on first launch in airplane mode apart from Firebase (verified via Chrome remote debugging).
- N4 No new permissions beyond Internet (and network state if needed). No analytics, no ads.

## 6. Out of scope (Phase 1)

Play Store listing, iOS, prayer-time reminders / notifications, home-screen widget, Google sign-in, Firebase SDK upgrade, dark mode, data-model changes.

## 7. Open decisions for the CEO

All four decided by the CEO on 20-Oct-2026.

| # | Decision | Outcome |
|---|----------|---------|
| D1 | App ID (permanent once installed/published) | `com.frawan.ibadahtracker` |
| D2 | Name under the icon | `Ibadah Tracker` |
| D3 | Release signing | Stable keystore in GitHub Secrets (Dave generates it; Farrukh adds the secrets and keeps an offline copy) |
| D4 | Icon artwork | Dave drafts a simple emerald mosque/crescent mark for CEO approval |

## 8. Acceptance tests (Quantum runs these on every PR)

### 8.1 Web regression (must pass before any merge — G2)
1. Open GitHub Pages build from the PR branch preview / local server: page loads with network throttled and with DevTools showing no jsdelivr/gstatic requests.
2. Log in, tick a prayer, see it on a second device within seconds.
3. Batch buttons, Reset Day, date arrows, Nafal/Quran checkboxes, manual month inputs, chart, Incomplete Days, Overview table all behave as on v2.0.
4. Backup download and restore on desktop Chrome.
5. Desktop layout pixel-compare against v2.0 at 1280 px and 1920 px.

### 8.2 Android (phone + tablet emulator, plus one real device)
1. Install debug APK from the Actions artifact; icon and splash correct.
2. First launch offline in local mode: app fully styled, chart drawn.
3. Register a test account, log in, close app, reopen → still signed in (R3.2).
4. Two-way sync with the web on a laptop (R3.3).
5. Airplane mode: log 3 prayers, force-close, reopen, turn network on → *Saved ✓* and laptop shows them (R3.4).
6. Backup → share sheet → save to Files; restore that file on the web, and a web backup on the app (R4).
7. Back button, Reset confirm dialog (Cancel and OK), rotation mid-entry (R2.4, R2.5, R5.6).
8. Tablet portrait and landscape layouts, phone at 360 px (R5).
9. Install release APK `v2.1.0`, then `v2.1.1` over it → update installs, data kept (R7.3).

## 9. Delivery plan

| PR | Content | Gate |
|----|---------|------|
| 1 | R1 offline libraries + R5.7 wording (web-only change) | §8.1 |
| 2 | R2, R3, R4 Capacitor wrapper + backup on Android, plus R7.1 test-APK build (moved forward so the app can be tested on a phone) | §8.1 + §8.2 items 1–7 |
| 3 | R5 tablet/phone layout | §8.1 + §8.2 item 8 |
| 4 | R6 icon/splash + R7.2–R7.5 signed release build | §8.2 items 1, 9 |

Each PR is approved and merged by the CEO; Quantum posts the test results in the PR before asking.
