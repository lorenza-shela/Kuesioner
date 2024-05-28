import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANTaJHikxb25EfF_ovcf_bP_nFOej1pwE",
  authDomain: "kuisioner-36f30.firebaseapp.com",
  projectId: "kuisioner-36f30",
  storageBucket: "kuisioner-36f30.appspot.com",
  messagingSenderId: "1022737859863",
  appId: "1:1022737859863:web:2e24d2fe4103acb87fa352",
  measurementId: "G-SCX59V0M8L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
