/* ------------------------------------------------------------------------------------------------------------------ */
/*                                              Techno: js natif + jquery                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

"use strict";

import $ from "jquery";

/* ---------------------------------------------------- Variables --------------------------------------------------- */
const apiKey = "34019c68";
let timeoutNotif;
let currentPage = 1;
/* ---------------------------------------------------- Functions --------------------------------------------------- */

//fonction appelé à chaque clique sur le bouton pour construire l'url à donner à la fonction fetch
function searchFilm(nbrPage) {
    let searchURL = `https://www.omdbapi.com/?apikey=${apiKey}`;

    //séries de tests pour construire l'url par concaténation
    if ($("#title").val() === "") {
        //se référer à la fonction addFilm du script de base
        if (typeof timeoutNotif !== undefined) clearTimeout(timeoutNotif);
        $(".notif").remove();
        $(`<p>Vous devez rentrer un titre</p>`)
            .addClass(
                "fixed top-10 left-1/2 -translate-x-1/2 border border-white/30 rounded-xl w-fit text-center text-red-600 text-lg z-10 bg-red-900/90 p-3 notif"
            )
            .appendTo("body");
        timeoutNotif = setTimeout(() => $(".notif").remove(), 3000);
        return;
    } else {
        searchURL += `&s=${$("#title").val()}`;
    }
    if ($("#year").val() !== "") searchURL += `&y=${$("#year").val()}`;
    if ($("#typeFilm").val() !== "---Type du film---") searchURL += `&type=${$("#typeFilm").val()}`;
    if (typeof nbrPage === "number" && nbrPage !== 1) searchURL += `&page=${nbrPage}`;
    fetchAPI(searchURL);
}

//fonction d'appelle à l'API et transmet le json
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error problem: ${response.status}`);
        let json = response.json();
        handlerData(json);
    } catch (error) {
        console.error(`Problem : ${error.message}`);
    }
}

async function handlerData(json) {
    let data = await json;
    let nbrPage = Math.ceil(Number(data.totalResults) / 10);

    $("#pagination").empty();
    for (let i = 1; i <= nbrPage; i++) {
        if (i == nbrPage)
            $(
                `<button class="px-4 p-1 hover:bg-neutral-300 rounded-e-md pagination" type="button" id="${i}">${i}</button>`
            ).appendTo("#pagination");
        else $(`<button class="buttonPag pagination" type="button" id="${i}">${i}</button>`).appendTo("#pagination");
    }
    $(`#${currentPage}`).addClass("selectedPage");
    $(".pagination").on("click", function () {
        currentPage = Number($(this).attr("id"));
        console.log(currentPage);

        searchFilm(currentPage);
    });
    displaySearch(data.Search);
}

function displaySearch(search) {
    let films = search;
    let elementHtml = films
        .map(
            (elem) => `<div
                            class="flex flex-col w-fit items-center bg-linear-to-tl from-cyan-950 from-20% to-teal-600/80 p-5 rounded-2xl gap-2 shadow-2xl shadow-black"
                        >
                            <img
                                class="rounded-2xl shadow-xl shadow-black/50 w-[300px]"
                                src=${elem.Poster}
                                alt=${elem.Title}
                            />
                            <h3 class="font-bold">${elem.Title}</h3>
                            <small class="italic text-lg">${elem.Year}</small>
                        </div>`
        )
        .join("");
    $("#displayFilm").empty();
    $(elementHtml).appendTo("#displayFilm");
}
/* ----------------------------------------------------- Script ----------------------------------------------------- */

$("#buttonSearch").on("click", function () {
    currentPage = 1;
    searchFilm(currentPage);
});
