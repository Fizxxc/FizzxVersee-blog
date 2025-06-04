import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCsp_hLW1819Wc5B6zA1TBtWYc-tdXIzu8",
  authDomain: "online-order-a6d5d.firebaseapp.com",
  projectId: "online-order-a6d5d",
  storageBucket: "online-order-a6d5d.firebasestorage.app",
  messagingSenderId: "663336912583",
  appId: "1:663336912583:web:e14d5e73d25e068a05e0e2",
  databaseURL: "https://console.firebase.google.com/project/online-order-a6d5d/database/online-order-a6d5d-default-rtdb/data/~2F?hl=id"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
