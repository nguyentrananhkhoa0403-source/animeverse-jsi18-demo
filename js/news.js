const newsGrid = document.querySelector("#newsGrid");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");

let newsData = [];

async function getNews() {
	try {
		newsGrid.innerHTML = `
			<div class="loading">
				<i class="fa-solid fa-spinner fa-spin"></i>
				<p>Loading anime news...</p>
			</div>
		`;

		const response = await fetch("https://api.tenrai.org/v1/news");

		if (!response.ok) {
			throw new Error("API Error: " + response.status);
		}

		const result = await response.json();

		console.log(result);

		newsData = result.articles || [];

		renderNews(newsData);

	} catch (error) {
		console.log(error);

		newsGrid.innerHTML = `
			<div class="loading">
				<i class="fa-solid fa-circle-exclamation"></i>
				<p>Không thể tải tin tức.</p>
			</div>
		`;
	}
}

function renderNews(news) {
	newsGrid.innerHTML = "";

	if (news.length === 0) {
		newsGrid.innerHTML = `
			<div class="loading">
				<p>Không tìm thấy tin tức.</p>
			</div>
		`;

		return;
	}

	news.forEach(function(item) {
		const card = document.createElement("article");

		card.className = "news-card";

		const image =
			item.image ||
			"https://via.placeholder.com/600x400";

		const date = item.publishedAt
			? new Date(item.publishedAt).toLocaleDateString("vi-VN")
			: "Unknown date";

		card.innerHTML = `
			<div class="news-image">
				<img
					src="${image}"
					alt="${item.title}"
				>

				<span class="news-category">
					ANIME
				</span>
			</div>

			<div class="news-content">

				<p class="news-date">
					<i class="fa-regular fa-calendar"></i>
					${date}
				</p>

				<h3>
					${item.title}
				</h3>

				<p>
					${item.description || "No description available."}
				</p>

				<a
					href="${item.url}"
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
}

function filterNews() {
	const keyword = searchInput.value.toLowerCase().trim();
	const category = categorySelect.value;

	const filteredNews = newsData.filter(function(item) {
		const title = (item.title || "").toLowerCase();
		const description = (item.description || "").toLowerCase();
		const content = (item.content || "").toLowerCase();

		const matchSearch =
			title.includes(keyword) ||
			description.includes(keyword) ||
			content.includes(keyword);

		let matchCategory = true;

		if (category === "anime") {
			matchCategory =
				title.includes("anime") ||
				description.includes("anime") ||
				content.includes("anime");
		}

		if (category === "movie") {
			matchCategory =
				title.includes("movie") ||
				description.includes("movie") ||
				content.includes("movie");
		}

		if (category === "event") {
			matchCategory =
				title.includes("event") ||
				description.includes("event") ||
				content.includes("event");
		}

		return matchSearch && matchCategory;
	});

	renderNews(filteredNews);
}

searchInput.addEventListener("input", filterNews);

categorySelect.addEventListener("change", filterNews);

getNews();