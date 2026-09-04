const exploreBtn = document.getElementById("exploreBtn");
const moreButtons = document.querySelectorAll(".more-btn");
const navLinks = document.querySelectorAll(".nav-links a");

exploreBtn.addEventListener("click", function () {
    document.querySelector("#anime").scrollIntoView({
        behavior: "smooth"
    });
});

moreButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const title = this.parentElement.querySelector("h3").textContent;
        alert("Bạn đã chọn: " + title);
    });
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        this.classList.add("active");
    });
});

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "#020617";
    } else {
        navbar.style.background = "#111827";
    }
});

const animeGrid = document.getElementById("animeGrid");

fetch("https://api.jikan.moe/v4/top/anime")
    .then(res => res.json())
    .then(data => {
        const topAnime = data.data.slice(0, 4);

        topAnime.forEach(anime => {

            let animePage = anime.url;

            if (anime.mal_id === 52991) {
                animePage = "html/frieren.html";
            }

            if (anime.mal_id === 61316) {
                animePage = "html/rezero.html";
            }

            if (anime.mal_id === 5114) {
                animePage = "html/fmab.html";
            }

            if (anime.mal_id === 61469) {
                animePage = "html/jojo.html";
            }

            animeGrid.innerHTML += `
                <div class="card">
                    <img 
                        src="${anime.images.jpg.large_image_url}" 
                        alt="${anime.title}"
                    >

                    <h3>${anime.title}</h3>

                    <p>⭐ ${anime.score}</p>

                    <a href="${animePage}">
                        <button class="more-btn">
                            Read More
                        </button>
                    </a>
                </div>
            `;
        });
    })
    .catch(error => {
        console.log("API Error:", error);
    });