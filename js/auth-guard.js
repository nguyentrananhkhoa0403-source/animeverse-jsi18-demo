import { getAuth, onAuthStateChanged } from
    "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "./login.html";
    }
});