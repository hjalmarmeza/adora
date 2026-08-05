import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "premium-lyrics-repo-hm",
  appId: "1:985614576606:web:2e5679e41b70f467de0b4f",
  storageBucket: "premium-lyrics-repo-hm.firebasestorage.app",
  apiKey: "AIzaSyC6k3AD4f2QcNyqGOICuA80A9FBopAPVm8",
  authDomain: "premium-lyrics-repo-hm.firebaseapp.com",
  messagingSenderId: "985614576606",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
