// firebase-config.js - Configuración e Inicialización de Firebase SDK (v10 Modular)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración web de Firebase
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