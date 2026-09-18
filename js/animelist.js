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

animeForm.addEventListener("submit", function(e) {
	e.preventDefault();

	const anime = {
		id: editId || Date.now(),
		name: animeName.value.trim(),
		genre: animeGenre.value.trim(),
		year: animeYear.value,
		image: animeImage.value.trim(),
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
});

function editAnime(id) {
	const anime = animeData.find(item => item.id === id);

	if (!anime) {
		return;
	}

	animeName.value = anime.name;
	animeGenre.value = anime.genre;
	animeYear.value = anime.year;
	animeImage.value = anime.image;
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