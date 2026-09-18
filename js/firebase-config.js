import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwwLMQKj7xq5w-rb25VSkS2va5G2L9z7k",
  authDomain: "animeverse-d545c.firebaseapp.com",
  projectId: "animeverse-d545c",
  storageBucket: "animeverse-d545c.firebasestorage.app",
  messagingSenderId: "154016294368",
  appId: "1:154016294368:web:b8596dd84c42e1002e7785"
};

const app = initializeApp(firebaseConfig);

export { app };