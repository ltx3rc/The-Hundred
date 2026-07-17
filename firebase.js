// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyCD-XpA3Quu2pHMrg4qZKGC3_fvbigPixg",

  authDomain: "the-hundred-ac2d3.firebaseapp.com",

  projectId: "the-hundred-ac2d3",

  storageBucket: "the-hundred-ac2d3.firebasestorage.app",

  messagingSenderId: "1094366558018",

  appId: "1:1094366558018:web:af8c45af4ab1afad0ffadb"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
