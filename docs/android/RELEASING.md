# Releasing the Android app

Two kinds of APK come out of GitHub Actions:

| | Test build | Release |
|---|---|---|
| Name on the phone | Ibadah Tracker (test) | **Ibadah Tracker** |
| App ID | `com.frawan.ibadahtracker.debug` | `com.frawan.ibadahtracker` |
| Built when | Every push to an `android/...` branch and every pull request | Only when the CEO starts it |
| Where to get it | *Actions* → *Android build* run → *Artifacts* | *Releases* page of the repo |
| Signed with | Shared test key in the repo | Private release key (GitHub secrets only) |

The two install side by side and keep separate local data. Signed-in data is the same in both (Firestore).

## One-time setup: signing secrets

The release key is **not** in the repo. Add these four secrets in GitHub
(*Settings → Secrets and variables → Actions → New repository secret*):

| Secret | Value |
|---|---|
| `RELEASE_KEYSTORE_BASE64` | The keystore file as base64 (one line) |
| `RELEASE_KEYSTORE_PASSWORD` | Keystore password |
| `RELEASE_KEY_ALIAS` | `ibadahtracker` |
| `RELEASE_KEY_PASSWORD` | Key password (same as the keystore password) |

Keep at least two offline copies of the keystore and its password. **If the key is lost, updates can no longer install over the app on existing phones.**

## Making a release (CEO)

1. Make sure everything you want is merged to `main`.
2. *Actions* → **Release** → **Run workflow** → enter a new version (e.g. `2.1.0`) → **Run workflow**.
3. When it finishes (about 5 minutes), the APK is on the *Releases* page as `ibadah-tracker-v2.1.0.apk`.
4. Open that page on the phone, download the APK and install. Later releases install over it and keep the data.

The workflow fails with a clear message if a secret is missing or the version isn't in the form `2.1.0`. Each release's version code is 100 + the run number, so it is always higher than the previous release.

## Icon and splash screen

Source artwork is in `resources/` (`icon*.svg` / `.png`, `splash.png`). To change it, replace those files and run:

```
npx capacitor-assets generate --android --iconBackgroundColor '#047857' --splashBackgroundColor '#047857'
```

then restore `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher*.xml` (the generator adds an inset that makes the mosque too small).
