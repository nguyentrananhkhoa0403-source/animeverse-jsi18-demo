const API_URL = "https://aninews.vercel.app/api/news?limit=10";

const newsGrid = document.querySelector("#newsGrid");

async function getNews() {
	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			throw new Error("API Error: " + response.status);
		}

		const result = await response.json();

		console.log(result);

		const articles = result.data?.articles || result.data || [];

		newsGrid.innerHTML = "";

		articles.forEach(function(item) {
			const card = document.createElement("article");

			card.className = "news-card";

			card.innerHTML = `
				<div class="news-image">
					<img
						src="${item.image || "https://via.placeholder.com/600x400"}"
						alt="${item.title || "Anime News"}"
					>
					<span class="news-category">
						${item.source || "Anime News"}
					</span>
				</div>

				<div class="news-content">
					<p class="news-date">
						<i class="fa-regular fa-calendar"></i>
						${item.date
							? new Date(item.date).toLocaleDateString("vi-VN")
							: ""}
					</p>

					<h3>${item.title || "Anime News"}</h3>

					<p>
						${item.excerpt || "No description available."}
					</p>

					<a
						href="${item.link || "#"}"
						target="_blank"
						class="read-more"
					>
						Read More
						<i class="fa-solid fa-arrow-right"></i>
					</a>
				</div>
			`;

			newsGrid.appendChild(card);
		});

	} catch (error) {
		console.error(error);

		newsGrid.innerHTML = `
			<div class="loading">
				<i class="fa-solid fa-circle-exclamation"></i>
				<p>Không thể tải tin tức.</p>
			</div>
		`;
	}
}

getNews();