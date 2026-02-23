// Firebase configuration and initialization for Admin Panel
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Laichi Firebase configuration
const defaultFirebaseConfig = {
  apiKey: "AIzaSyCEkFAM4TEZx6k97MRto3XxTe1B6Dx8ys0",
  authDomain: "laichi-c3db9.firebaseapp.com",
  projectId: "laichi-c3db9",
  storageBucket: "laichi-c3db9.firebasestorage.app",
  messagingSenderId: "759360416923",
  appId: "1:759360416923:web:23b93c8016d52fae33ea3e",
  measurementId: "G-VCW6M793KH",
};

let firebaseConfig = defaultFirebaseConfig;

// Fetch Firebase config from backend
async function fetchFirebaseConfig() {
  try {
    const baseUrl = process.env.VITE_APP_API_BASE_URL || "http://localhost:5055/api";
    const response = await fetch(`${baseUrl}/setting/firebase/config`);
    if (response.ok) {
      const config = await response.json();
      if (config.enabled) {
        return {
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
          measurementId: config.measurementId,
        };
      }
    }
  } catch (error) {
    console.warn("Using default Firebase config:", error.message);
  }
  return null;
}

// Initialize Firebase
let app;
let auth;

const initializeFirebase = async () => {
  if (getApps().length === 0) {
    // Try to fetch config from backend
    const backendConfig = await fetchFirebaseConfig();
    if (backendConfig) {
      firebaseConfig = backendConfig;
      console.log("✅ Using Firebase config from backend");
    } else {
      console.log("✅ Using default Firebase config");
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }

  return { app, auth };
};

// Initialize immediately
initializeFirebase();

export { auth, initializeFirebase };
export default app;
