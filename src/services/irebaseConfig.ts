import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQ0AsFcnwdb1AF1jQhIPXCEGECOMzVqe0",
    authDomain: "bd-bv-cadastro-profissional.firebaseapp.com",
    projectId: "bd-bv-cadastro-profissional",
    storageBucket: "bd-bv-cadastro-profissional.firebasestorage.app",
    messagingSenderId: "958338993993",
    appId: "1:958338993993:web:07af005697c1dad5a31498"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
