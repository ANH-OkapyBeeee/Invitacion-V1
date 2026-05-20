import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "invitacion-lupis-v2",
  appId: "1:143224661454:web:9f3a0867846877a32af79f",
  apiKey: "AIzaSyCOyx2Uz7nSzt3KZAVHISvqSX8Sn5DOUt4",
  authDomain: "invitacion-lupis-v2.firebaseapp.com",
  messagingSenderId: "143224661454",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
