import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwwLMQKj7xq5w-rb25VSkS2va5G2L9z7k",
  authDomain: "animeverse-d545c.firebaseapp.com",
  projectId: "animeverse-d545c",
  storageBucket: "animeverse-d545c.firebasestorage.app",
  messagingSenderId: "154016294368",
  appId: "1:154016294368:web:b8596dd84c42e1002e7785"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const animeCollection = collection(db, "animes");

let animeData = [];
let editId = null;
async function getAnime() {
    try {
        const snapshot = await getDocs(animeCollection);

        animeData = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
        }));

        renderAnime();
    } catch (error) {
        console.error("Lỗi lấy anime:", error);
    }
}

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
                            <button class="edit-btn" onclick="editAnime('${anime.id}')">
                                <i class="fa-solid fa-pen"></i> Edit
                            </button>

                            <button class="delete-btn" onclick="deleteAnime('${anime.id}')">
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
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Upload ảnh thất bại");
    }

    const data = await response.json();

    return data.secure_url;
}

animeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang xử lý...";

        const name = animeName.value.trim();
        const genre = animeGenre.value.trim();
        const year = animeYear.value;
        const description = animeDescription.value.trim();

        const file = animeImage.files[0];

        if (editId) {
            const oldAnime = animeData.find(
                (anime) => anime.id === editId
            );

            let imageUrl = oldAnime.image;

            if (file) {
                submitBtn.textContent = "Đang upload ảnh...";
                imageUrl = await uploadImage(file);
            }

            await updateDoc(
                doc(db, "animes", editId),
                {
                    name,
                    genre,
                    year,
                    image: imageUrl,
                    description
                }
            );

            alert("Cập nhật thành công!");
        } else {
            if (!file) {
                alert("Vui lòng chọn ảnh!");
                return;
            }

            submitBtn.textContent = "Đang upload ảnh...";

            const imageUrl = await uploadImage(file);

            await addDoc(animeCollection, {
                name,
                genre,
                year,
                image: imageUrl,
                description
            });

            alert("Thêm anime thành công!");
        }

        animeForm.reset();
        editId = null;

        formTitle.textContent = "Thêm Anime";
        submitBtn.textContent = "Thêm anime";
        cancelBtn.style.display = "none";

        await getAnime();

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
    }
});

window.editAnime = function (id) {
    const anime = animeData.find(
        (item) => item.id === id
    );

    if (!anime) return;

    animeName.value = anime.name;
    animeGenre.value = anime.genre;
    animeYear.value = anime.year;
    animeDescription.value = anime.description || "";

    editId = id;

    formTitle.textContent = "Sửa Anime";
    submitBtn.textContent = "Cập nhật";
    cancelBtn.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

window.deleteAnime = async function (id) {
    const anime = animeData.find(
        (item) => item.id === id
    );

    if (!anime) return;

    if (!confirm(`Bạn có chắc muốn xóa "${anime.name}" không?`)) {
        return;
    }

    try {
        await deleteDoc(
            doc(db, "animes", id)
        );

        alert("Xóa thành công!");

        await getAnime();

    } catch (error) {
        console.error("Lỗi xóa:", error);
        alert("Không thể xóa anime!");
    }
};

cancelBtn.addEventListener("click", () => {
    animeForm.reset();

    editId = null;

    formTitle.textContent = "Thêm Anime";
    submitBtn.textContent = "Thêm anime";
    cancelBtn.style.display = "none";
});

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    const result = animeData.filter((anime) =>
        anime.name.toLowerCase().includes(keyword)
    );

    renderAnime(result);
});

getAnime();