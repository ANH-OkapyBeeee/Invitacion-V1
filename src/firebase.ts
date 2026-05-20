import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "invitacion-lupis-v1-app",
  appId: "1:841990351541:web:8d250d0177a5e1ca82ecfc",
  storageBucket: "invitacion-lupis-v1-app.firebasestorage.app",
  apiKey: "AIzaSyCK5iJGTORbh_I7u3MMkuXL4Fu2X7ezX5c",
  authDomain: "invitacion-lupis-v1-app.firebaseapp.com",
  messagingSenderId: "841990351541",
  projectNumber: "841990351541"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
