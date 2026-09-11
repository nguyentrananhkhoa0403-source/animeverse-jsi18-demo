import { getAuth, onAuthStateChanged } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Chưa đăng nhập -> chuyển về trang login
        window.location.href = "login.html";
    }
});
const animeList=document.getElementById("animeList");
const nextButton=document.getElementById("nextButton");
const backButton=document.getElementById("backButton");
let currentPage=1;
function loadAnime(page){
    animeList.innerHTML="";
    fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`)
    .then(res=>res.json())
    .then(data=>{
        data.data.forEach((anime,index)=>{
            const rank=(page-1)*25+index+1;
            animeList.innerHTML+=`
            <div class="anime-item">
                <span class="anime-rank">#${rank}</span>
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <div class="anime-info">
                    <h2>${anime.title}</h2>
                    <p>⭐ ${anime.score||"N/A"}</p>
                    <p>Episodes: ${anime.episodes||"N/A"}</p>
                    <p>Type: ${anime.type||"N/A"}</p>
                </div>
            </div>
            `;
        });
    })
    .catch(error=>{
        console.log("API Error:",error);
    });
}
loadAnime(currentPage);
nextButton.addEventListener("click",()=>{
    currentPage++;
    loadAnime(currentPage);
});
backButton.addEventListener("click",()=>{
    if(currentPage>1){
        currentPage--;
        loadAnime(currentPage);
    }
});