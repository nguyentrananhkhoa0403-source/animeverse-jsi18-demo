import {
	getAuth,
	createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);

const registerForm = document.querySelector("#registerForm");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmPasswordError = document.querySelector("#confirmPasswordError");

registerForm.addEventListener("submit", async function(event) {
	event.preventDefault();

	usernameError.textContent = "";
	emailError.textContent = "";
	passwordError.textContent = "";
	confirmPasswordError.textContent = "";

	const username = usernameInput.value.trim();
	const email = emailInput.value.trim();
	const password = passwordInput.value;
	const confirmPassword = confirmPasswordInput.value;

	let isValid = true;

	if (username === "") {
		usernameError.textContent = "Vui lòng nhập username.";
		isValid = false;
	} else if (username.length < 6 || username.length > 18) {
		usernameError.textContent = "Username phải từ 6 đến 18 ký tự.";
		isValid = false;
	}

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
	} else if (password.length < 6 || password.length > 18) {
		passwordError.textContent = "Mật khẩu phải từ 6 đến 18 ký tự.";
		isValid = false;
	}

	if (confirmPassword === "") {
		confirmPasswordError.textContent = "Vui lòng xác nhận mật khẩu.";
		isValid = false;
	} else if (confirmPassword !== password) {
		confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp.";
		isValid = false;
	}

	if (!isValid) {
		return;
	}

	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		console.log("Đăng ký thành công:", userCredential.user);

		localStorage.setItem(
			"currentUser",
			JSON.stringify({
				uid: userCredential.user.uid,
				email: userCredential.user.email,
				username: username
			})
		);

		alert("Đăng ký thành công!");

		window.location.href = "../login.html";

	} catch (error) {
		console.log(error);

		if (error.code === "auth/email-already-in-use") {
			emailError.textContent = "Email này đã được đăng ký.";
		} else if (error.code === "auth/invalid-email") {
			emailError.textContent = "Email không hợp lệ.";
		} else if (error.code === "auth/weak-password") {
			passwordError.textContent = "Mật khẩu quá yếu.";
		} else {
			passwordError.textContent = "Đăng ký thất bại. Vui lòng thử lại.";
		}
	}
});