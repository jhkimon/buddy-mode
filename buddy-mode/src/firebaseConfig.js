import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config');
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 디버깅: Firebase 설정 값 확인
console.log('Firebase Config:', firebaseConfig);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 디버깅: Firebase 앱 객체 확인
console.log('Firebase App Initialized:', app);

const database = getDatabase(app);

// 디버깅: Firebase Database 객체 확인
console.log('Firebase Database Initialized:', database);

export { app, database };
