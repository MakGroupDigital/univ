import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQeSFSIUhWeBbXe3ulFX70yOBs65I_LvM",
  authDomain: "studio-8028690720-413a1.firebaseapp.com",
  projectId: "studio-8028690720-413a1",
  storageBucket: "studio-8028690720-413a1.firebasestorage.app",
  messagingSenderId: "621866349027",
  appId: "1:621866349027:web:0b8472dd6dd48238d370d6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
