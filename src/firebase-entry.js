// Firebase 10.8.0, bundled locally so the app works offline and inside the Android app.
// Exposed as window.FirebaseSDK (classic script) so index.html still opens by double-click (file://).
export { initializeApp } from "firebase/app";
export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
export {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  onSnapshot,
  FieldPath
} from "firebase/firestore";
