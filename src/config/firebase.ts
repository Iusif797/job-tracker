import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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
const missingVars = requiredEnvVars.filter(varName => {
  const value = process.env[varName];
  return !value || value.trim() === '';
});

if (missingVars.length > 0) {
  console.error('Missing or empty required environment variables:', missingVars);
  throw new Error(`Missing Firebase configuration: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!
};

// Проверяем, что все значения в конфигурации определены
const missingConfig = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value || value.trim() === '')
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.error('Missing or empty Firebase config values:', missingConfig);
  throw new Error(`Invalid Firebase configuration: ${missingConfig.join(', ')}`);
}

console.log('Firebase config prepared:', {
  ...firebaseConfig,
  apiKey: '***' // Скрываем API ключ в логах
});

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

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
  throw new Error('Failed to initialize Firebase services');
}

if (!auth || !db) {
  throw new Error('Firebase services not properly initialized');
}

export { auth, db };
export default app; 