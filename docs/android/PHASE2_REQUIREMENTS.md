# Ibadah Tracker — Phase 2 Requirements: Privacy, Account Deletion, App Download

**Author:** Quantum (QA / Docs) · **Status:** Approved scope from the CEO (20-Oct-2026) · **Builder:** Dave
**Rule:** nothing merges to `main` without the CEO's explicit approval.

## 1. Goal

Distribute the Android app for free through GitHub Releases, and meet the privacy basics now (they are also Google Play requirements, if the app goes there later):

1. Users can delete their account and all its cloud data, inside the app and on the website.
2. A short privacy page says what is stored and how to remove it.
3. A "Get the Android app" page gives one link to share.

## 2. Requirements

### P1 — Delete account (in the app and on the website)
- P1.1 Signed-in users see **Delete my account** in the sync bar, set apart from Sign Out.
- P1.2 Pressing it asks for confirmation and the account password (Firebase requires a recent sign-in to delete an account). A wrong password shows a clear message and deletes nothing.
- P1.3 On confirmation: delete the Firestore document `users/{uid}`, then delete the Firebase Auth user, then clear the local copy on the device. The app returns to local mode with an empty tracker.
- P1.4 Order matters: the data is deleted first, so a failure can never leave cloud data without an account that can reach it. If the data deletion fails (e.g. offline), stop and tell the user to try again online.
- P1.5 Requires a connection; offline it says so instead of queueing.
- P1.6 Suggest downloading a backup first (link to the backup button).

### P2 — Delete account web page (`delete-account.html`)
- P2.1 Standalone page on the website: email + password + confirm → same deletion as P1.3. Works without installing or opening the app (Google Play account-deletion rule).
- P2.2 Names the app ("Ibadah Tracker") and lists exactly what is deleted, and that local-mode data on a device is not in the cloud and is removed by uninstalling or *Wipe Data*.

### P3 — Privacy page (`privacy.html`)
- P3.1 Plain language, short. Covers: what is stored (email, prayer/Quran/Nafal logs, monthly percentages), where (Google Firebase), what is **not** collected (no analytics, ads, location, contacts, tracking), local mode, who can see the data (only the signed-in user, enforced by Firestore rules), how to delete, contact (GitHub issues), and the date.
- P3.2 Linked from the app footer, the delete page and the download page.

### P4 — Get the Android app (`android.html`)
- P4.1 Big download button that always gives the newest release, no edit needed after each release.
- P4.2 Shows the latest version number when it can be fetched; works without it.
- P4.3 Three-step install instructions (download, allow "install unknown apps", open), plus "updates install over the old version, your data stays".
- P4.4 Link back to the web app and the privacy page.
- P4.5 The footer link to this page is hidden inside the Android app itself.

### P5 — Release workflow
- P5.1 Each release also uploads the APK under a fixed name `ibadah-tracker.apk`, so `…/releases/latest/download/ibadah-tracker.apk` always works.

### P6 — Packaging
- P6.1 The new pages are included in the APK so the footer links work offline in the app.

## 3. Acceptance tests
1. Website: register a test account, log some days, Delete my account with a wrong password → error, nothing deleted.
2. Same with the right password → signed out, Firestore document gone, account can no longer sign in, local copy cleared.
3. Same flow on `delete-account.html`.
4. Android app: same as 2.
5. Privacy and download pages at 360 px and desktop: readable, no sideways scroll.
6. Download button gets the latest APK; version label shows.
7. Footer links work on the website and in the app; "Get the Android app" hidden in the app.
8. Existing features unchanged (§8.1 of Phase 1).

## 4. Out of scope
Google Play submission (on hold, US$25 fee), forgotten-password reset, email change.
