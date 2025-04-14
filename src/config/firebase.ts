import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Starting Firebase initialization...');

const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
] as const;

// Проверяем наличие всех необходимых переменных окружения
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.log('Available environment variables:', process.env);
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('Firebase config prepared:', {
  ...firebaseConfig,
  apiKey: '***' // Скрываем API ключ в логах
});

let app;
let auth;
let db;

try {
  console.log('Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');

  console.log('Initializing Firebase Auth...');
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');

  console.log('Initializing Firestore...');
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Прокидываем ошибку дальше для отлова в ErrorBoundary
}

export { auth, db };
export default app; 