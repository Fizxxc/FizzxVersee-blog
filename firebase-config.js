// Versi konsisten: 11.8.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

// Konfigurasi Firebase yang benar
  const firebaseConfig = {
    apiKey: "AIzaSyCsp_hLW1819Wc5B6zA1TBtWYc-tdXIzu8",
    authDomain: "online-order-a6d5d.firebaseapp.com",
    databaseURL: "https://online-order-a6d5d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "online-order-a6d5d",
    storageBucket: "online-order-a6d5d.appspot.app",
    messagingSenderId: "663336912583",
    appId: "1:663336912583:web:e14d5e73d25e068a05e0e2",
    measurementId: "G-SNYEZ2VS5N"

  };


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };
