import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDC8wtOGFIJQ2FrtsAZKRWWxYnYYeHUWdw",
  authDomain: "hand-grip-counter.firebaseapp.com",
  projectId: "hand-grip-counter",
  storageBucket: "hand-grip-counter.firebasestorage.app",
  messagingSenderId: "236399228934",
  appId: "1:236399228934:web:703eb26a7805ce1be06b87",
  measurementId: "G-CKE7WQQ7HP"
};

initializeApp(firebaseConfig);
const db = getFirestore()

export {
    db
}