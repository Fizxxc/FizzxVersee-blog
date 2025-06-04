// Versi konsisten: 11.8.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

// Konfigurasi Firebase yang benar
const firebaseConfig = {
  apiKey: "AIzaSyDpv9uvfdUPKnyBKESB2fDEUwuDn9Nzmtg",
  authDomain: "orderr-625c2.firebaseapp.com",
  databaseURL: "https://orderr-625c2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "orderr-625c2",
  storageBucket: "orderr-625c2.appspot.com",
  messagingSenderId: "891679772111",
  appId: "1:891679772111:web:1b5999b967bd17c87356ba",
  measurementId: "G-06W3BTP7HH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };
