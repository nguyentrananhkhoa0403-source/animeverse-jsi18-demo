const galleryContainer = document.getElementById("galleryContainer");

function setGalleryLayout() {
    const width = window.innerWidth;

    galleryContainer.style.display = "grid";
    galleryContainer.style.width = "100%";
    galleryContainer.style.maxWidth = "1400px";
    galleryContainer.style.margin = "0 auto";
    galleryContainer.style.gap = "16px";

    if (width <= 400) {
        galleryContainer.style.gridTemplateColumns = "repeat(1, minmax(0, 1fr))";
    } else if (width <= 650) {
        galleryContainer.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    } else if (width <= 900) {
        galleryContainer.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    } else if (width <= 1200) {
        galleryContainer.style.gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
    } else {
        galleryContainer.style.gridTemplateColumns = "repeat(7, minmax(0, 1fr))";
    }
}

setGalleryLayout();

window.addEventListener("resize", function () {
    setGalleryLayout();
});

const requests = [
    fetch("https://api.jikan.moe/v4/top/anime?page=1")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP Error: " + res.status);
            }

            return res.json();
        }),

    fetch("https://api.jikan.moe/v4/top/anime?page=2")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP Error: " + res.status);
            }

            return res.json();
        })
];

Promise.all(requests)
    .then(results => {
        const animeList = [
            ...results[0].data,
            ...results[1].data
        ].slice(0, 49);

        galleryContainer.innerHTML = "";

        animeList.forEach(anime => {
            const image =
                anime.images?.jpg?.large_image_url ||
                anime.images?.jpg?.image_url;

            if (!image) {
                return;
            }

            const galleryItem = document.createElement("div");

            galleryItem.style.width = "100%";
            galleryItem.style.height = "220px";
            galleryItem.style.minWidth = "0";
            galleryItem.style.overflow = "hidden";
            galleryItem.style.borderRadius = "12px";
            galleryItem.style.background = "#1e293b";
            galleryItem.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            galleryItem.style.transition = "0.3s ease";

            galleryItem.innerHTML = `
                <img
                    src="${image}"
                    alt="${anime.title}"
                    title="${anime.title}"
                    style="
                        width: 100%;
                        height: 100%;
                        display: block;
                        object-fit: cover;
                        transition: 0.3s ease;
                    "
                >
            `;

            const img = galleryItem.querySelector("img");

            galleryItem.addEventListener("mouseenter", function () {
                galleryItem.style.transform = "translateY(-5px)";
                galleryItem.style.borderColor = "#38bdf8";
                galleryItem.style.boxShadow =
                    "0 10px 25px rgba(0, 0, 0, 0.35)";

                img.style.transform = "scale(1.05)";
            });

            galleryItem.addEventListener("mouseleave", function () {
                galleryItem.style.transform = "translateY(0)";
                galleryItem.style.borderColor =
                    "rgba(255, 255, 255, 0.08)";
                galleryItem.style.boxShadow = "none";

                img.style.transform = "scale(1)";
            });

            galleryContainer.appendChild(galleryItem);
        });
    })
    .catch(error => {
        console.log("Gallery API Error:", error);

        galleryContainer.innerHTML = `
            <p style="color: white;">
                Unable to load gallery.
            </p>
        `;
    });