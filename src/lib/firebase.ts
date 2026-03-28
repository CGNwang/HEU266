import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This is a mock config for the UI-only demo as requested
// In a real app, this would be loaded from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "orange-match.firebaseapp.com",
  projectId: "orange-match",
  storageBucket: "orange-match.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
