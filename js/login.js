import {
	getAuth,
	signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);

const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");

loginForm.addEventListener("submit", async function(event) {
	event.preventDefault();

	emailError.textContent = "";
	passwordError.textContent = "";

	const email = emailInput.value.trim();
	const password = passwordInput.value;

	let isValid = true;

	if (email === "") {
		emailError.textContent = "Vui lòng nhập email.";
		isValid = false;
	} else if (!email.includes("@")) {
		emailError.textContent = "Email không hợp lệ.";
		isValid = false;
	}

	if (password === "") {
		passwordError.textContent = "Vui lòng nhập mật khẩu.";
		isValid = false;
	}

	if (!isValid) {
		return;
	}

	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		console.log("Đăng nhập thành công:", userCredential.user);

		localStorage.setItem(
			"currentUser",
			JSON.stringify({
				uid: userCredential.user.uid,
				email: userCredential.user.email
			})
		);

		alert("Đăng nhập thành công!");

		window.location.href = "../index.html";

	} catch (error) {
		console.log(error);

		if (error.code === "auth/invalid-email") {
			emailError.textContent = "Email không hợp lệ.";
		} else if (error.code === "auth/invalid-credential") {
			passwordError.textContent = "Email hoặc mật khẩu không đúng.";
		} else if (error.code === "auth/user-disabled") {
			emailError.textContent = "Tài khoản này đã bị vô hiệu hóa.";
		} else {
			passwordError.textContent = "Đăng nhập thất bại. Vui lòng thử lại.";
		}
	}
});
