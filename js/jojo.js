const animeImage=document.getElementById("animeImage");
const animeTitle=document.getElementById("animeTitle");
const animeJapanese=document.getElementById("animeJapanese");
const animeScore=document.getElementById("animeScore");
const animeEpisodes=document.getElementById("animeEpisodes");
const animeStatus=document.getElementById("animeStatus");
const animeType=document.getElementById("animeType");
const animeGenres=document.getElementById("animeGenres");
const animeSynopsis=document.getElementById("animeSynopsis");
const animeRank=document.getElementById("animeRank");
const animePopularity=document.getElementById("animePopularity");
const animeYear=document.getElementById("animeYear");
const animeDuration=document.getElementById("animeDuration");
fetch("https://api.jikan.moe/v4/anime/61469")
.then(response=>response.json())
.then(data=>{
    const anime=data.data;
    animeImage.src=anime.images.jpg.large_image_url;
    animeImage.alt=anime.title;
    animeTitle.textContent=anime.title;
    animeJapanese.textContent=anime.title_japanese||"";
    animeScore.textContent=`⭐ Score: ${anime.score||"N/A"}`;
    animeEpisodes.textContent=`Episodes: ${anime.episodes||"N/A"}`;
    animeStatus.textContent=`Status: ${anime.status||"N/A"}`;
    animeType.textContent=`Type: ${anime.type||"N/A"}`;
    animeSynopsis.textContent=anime.synopsis||"No synopsis available.";
    animeRank.textContent=anime.rank?`#${anime.rank}`:"N/A";
    animePopularity.textContent=anime.popularity?`#${anime.popularity}`:"N/A";
    animeYear.textContent=anime.year||"N/A";
    animeDuration.textContent=anime.duration||"N/A";
    animeGenres.innerHTML="";
    anime.genres.forEach(genre=>{
        animeGenres.innerHTML+=`<span>${genre.name}</span>`;
    });
})
.catch(error=>{
    console.log("API Error:",error);
    animeTitle.textContent="Unable to load anime";
    animeSynopsis.textContent="Something went wrong while loading the anime information.";
});