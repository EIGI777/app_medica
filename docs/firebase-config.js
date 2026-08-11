// firebase-config.js - Configuración e Inicialización de Firebase SDK (v10 Modular)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj7S3chvOsrdHhY14nNKLk1TizVPDuhOo",
  authDomain: "app-medica-gil.firebaseapp.com",
  projectId: "app-medica-gil",
  storageBucket: "app-medica-gil.firebasestorage.app",
  messagingSenderId: "650724391144",
  appId: "1:650724391144:web:0cc7d8c91af147d66eb15d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);