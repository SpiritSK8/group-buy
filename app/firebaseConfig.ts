// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSSENyDvPE-vzMQLMnqkfiDE0JFjnzz28",
  authDomain: "group-buy-b8c6e.firebaseapp.com",
  projectId: "group-buy-b8c6e",
  storageBucket: "group-buy-b8c6e.firebasestorage.app",
  messagingSenderId: "265518390192",
  appId: "1:265518390192:web:3188c5f3e2898b3d711475"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const database = getFirestore();