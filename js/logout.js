import { getAuth, signOut } from
    "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);

        alert("Đăng xuất thành công!");
        window.location.href = "./login.html";

    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        alert("Đăng xuất thất bại!");
    }
});