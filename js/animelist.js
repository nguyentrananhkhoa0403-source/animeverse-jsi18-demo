const CLOUD_NAME = "bubpr9od";
const UPLOAD_PRESET = "AnimeVerse";

const animeForm = document.getElementById("animeForm");
const animeName = document.getElementById("animeName");
const animeGenre = document.getElementById("animeGenre");
const animeYear = document.getElementById("animeYear");
const animeImage = document.getElementById("animeImage");
const animeDescription = document.getElementById("animeDescription");
const animeList = document.getElementById("animeList");
const searchInput = document.getElementById("searchInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");

let animeData = JSON.parse(localStorage.getItem("animeData")) || [];
let editId = null;

function renderAnime(data = animeData) {
	animeList.innerHTML = "";

	data.forEach(anime => {
		animeList.innerHTML += `
			<div class="col-md-4">
				<div class="anime-card">
					<img src="${anime.image}" alt="${anime.name}">
					<div class="anime-card-content">
						<h4>${anime.name}</h4>
						<p class="genre">${anime.genre}</p>
						<p>Release Year: ${anime.year}</p>
						<p>${anime.description}</p>
						<div class="anime-actions">
							<button class="edit-btn" onclick="editAnime(${anime.id})">
								<i class="fa-solid fa-pen"></i> Edit
							</button>
							<button class="delete-btn" onclick="deleteAnime(${anime.id})">
								<i class="fa-solid fa-trash"></i> Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		`;
	});
}

async function uploadImage(file) {
	const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET);

	const response = await fetch(url, {
		method: "POST",
		body: formData
	});

	if (!response.ok) {
		throw new Error("Upload image failed");
	}

	const data = await response.json();

	return data.secure_url;
}

animeForm.addEventListener("submit", async function(e) {
	e.preventDefault();

	const file = animeImage.files[0];

	try {
		submitBtn.disabled = true;
		submitBtn.innerHTML = "Uploading...";

		let imageUrl = "";

		if (editId) {
			const oldAnime = animeData.find(item => item.id === editId);
			imageUrl = oldAnime.image;

			if (file) {
				imageUrl = await uploadImage(file);
			}
		} else {
			if (!file) {
				alert("Please choose an image");
				submitBtn.disabled = false;
				submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Anime';
				return;
			}

			imageUrl = await uploadImage(file);
		}

		const anime = {
			id: editId || Date.now(),
			name: animeName.value.trim(),
			genre: animeGenre.value.trim(),
			year: animeYear.value,
			image: imageUrl,
			description: animeDescription.value.trim()
		};

		if (editId) {
			animeData = animeData.map(item => {
				return item.id === editId ? anime : item;
			});
		} else {
			animeData.push(anime);
		}

		localStorage.setItem("animeData", JSON.stringify(animeData));

		resetForm();
		renderAnime();
	} catch (error) {
		console.error(error);
		alert("Upload ảnh thất bại!");
	} finally {
		submitBtn.disabled = false;

		if (editId) {
			submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Anime';
		} else {
			submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Anime';
		}
	}
});

function editAnime(id) {
	const anime = animeData.find(item => item.id === id);

	if (!anime) {
		return;
	}

	animeName.value = anime.name;
	animeGenre.value = anime.genre;
	animeYear.value = anime.year;
	animeDescription.value = anime.description;

	editId = id;
	formTitle.textContent = "Edit Anime";
	submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Anime';
	cancelBtn.classList.remove("d-none");

	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
}

function deleteAnime(id) {
	animeData = animeData.filter(item => item.id !== id);

	localStorage.setItem("animeData", JSON.stringify(animeData));

	renderAnime();
}

function resetForm() {
	animeForm.reset();
	editId = null;
	formTitle.textContent = "Add Anime";
	submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Anime';
	cancelBtn.classList.add("d-none");
}

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", function() {
	const keyword = searchInput.value.toLowerCase();

	const result = animeData.filter(anime => {
		return anime.name.toLowerCase().includes(keyword);
	});

	renderAnime(result);
});

renderAnime();