// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trading-game-8686f.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    (process.env.NODE_ENV === 'development' ?
      "http://localhost:9000/?ns=trading-game-8686f" :
      "https://trading-game-8686f-default-rtdb.firebaseio.com"),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trading-game-8686f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trading-game-8686f.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Functions
export const functions = getFunctions(app);

// Use emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Connect to Functions emulator
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('Connected to Firebase Functions emulator');

    // Connect to Database emulator
    // Note: We're not using connectDatabaseEmulator here because we've already
    // specified the emulator URL in the databaseURL config above
    console.log('Using Firebase Database emulator via databaseURL config');
  } catch (error) {
    console.error('Failed to connect to Firebase emulators:', error);
  }
}

// Export callable functions
export const callFunction = (name: string, data: any) => {
  const functionRef = httpsCallable(functions, name);
  return functionRef(data);
};

export default app;
