\# 🕌 Interactive Ibadah \& Namaz Dashboard Tracker



A lightweight, privacy-focused, single-file web application designed to track daily prayers (Salah), Quran recitation, Nafal, and analyze long-term spiritual habits through dynamic monthly performance charts.



\---



\## 🚀 Key Features



\* \*\*Dual Logging Modes:\*\* Seamlessly switch between micro-logging (cycling individual prayers through \*Unprayed\*, \*Alone\*, or \*Jama'at\*) and \*\*Batch Logging Actions\*\* (`All Masjid`, `All Alone`, `Reset Day`).

\* \*\*Smart Year-Bound Timelines:\*\* Restructuring architecture that binds data to specific months and years (e.g., `Sep 2025` vs `Sep 2026`). Prevents future data overwrites during timeline structural adjustments.

\* \*\*Dynamic Workspace Reset:\*\* A master workspace control allowing users to purge historical logs and instantly generate a fresh, chronological 12-month tracker starting from the exact current month and year.

\* \*\*Cloud Sync Across Devices:\*\* Optional login (Firebase Auth + Firestore) syncs your logs between phone and laptop in real time. Works offline too: entries are saved on the device and upload automatically when you're back online. A status indicator shows \*Saving…\* / \*Saved ✓\* / \*Offline\*.

\* \*\*Local Mode:\*\* Without logging in, all data stays in your browser's local storage.



\* \*\*Data Portability:\*\* Includes full JSON import and export tools so you can download local backups and restore them on any device without loss.



\---



\## 🛠️ Tech Stack \& Dependencies



This project is optimized as a single-file portable utility that requires no compilation or installation:



\* \*\*Frontend Framework:\*\* Tailwind CSS v4 (via CDN)

\* \*\*Data Visualization:\*\* Chart.js \& ChartJS Plugin Datalabels (via CDN)

\* \*\*Storage Engine:\*\* Firebase Firestore (with offline cache) when logged in; browser `localStorage` otherwise

\* \*\*Auth:\*\* Firebase Authentication (email/password)



\---



\## 📂 Installation \& Usage Instructions



Since the entire system is encapsulated within a single codebase, launching it is immediate:



1\. \*\*Save the Code:\*\* Copy the tracking code into a file named `index.html`.

2\. \*\*Launch:\*\* Double-click the file to open it directly in any modern web browser—no local web server required.

3\. \*\*Log Data:\*\* Select a date, log your compliance, and manage your baseline percentages using the \*\*Update Previous Months Data\*\* control panel.

4\. \*\*Backup Regularly:\*\* Use the built-in backup panel to keep your personal records safe.



\---



\## 🔒 Firestore Security Rules

The Firebase API key in `index.html` is public by design. Your data is protected by Firestore rules, which must restrict each user to their own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
