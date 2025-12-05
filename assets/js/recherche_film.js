/* ------------------------------------------------------------------------------------------------------------------ */
/*                                      Technologie : js natif + jquery + animejs                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * Script de la page de recherche de film
 * @module script/recherche_film
 */

"use strict";

import $ from "jquery";
import { logo, wrongNotif } from "./animation";

/* ---------------------------------------------------- Variables --------------------------------------------------- */
const apiKey = "34019c68";
let timeoutNotif;
let currentPage = 1;
/* ---------------------------------------------------- Functions --------------------------------------------------- */

/**
 * Fonction appelée à chaque clique sur le bouton "Rechercher" pour construire l'url à donner au fetch
 * @param {number} nbrPage - Correspond à la page demandée par l'utilisateur (1 par défaut)
 */
function searchFilm(nbrPage) {
    let searchURL = `https://www.omdbapi.com/?apikey=${apiKey}`;

    //séries de tests pour construire l'url par concaténation
    if ($("#title").val() === "") {
        /**
         * @see addFilm
         */
        if (typeof timeoutNotif !== undefined) clearTimeout(timeoutNotif);
        $(".notif").remove();
        $(`<p>Vous devez rentrer un titre</p>`)
            .addClass(
                "fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full border border-white/30 rounded-xl w-fit text-center text-red-600 text-2xl z-10 bg-red-900/90 p-3 notif"
            )
            .appendTo("body");
        //animation notif
        wrongNotif();
        timeoutNotif = setTimeout(() => $(".notif").remove(), 8000);
        return;
    } else {
        searchURL += `&s=${$("#title").val()}`;
    }
    if ($("#year").val() !== "") searchURL += `&y=${$("#year").val()}`;
    if ($("#typeFilm").val() !== "---Type du film---") searchURL += `&type=${$("#typeFilm").val()}`;
    //ne rajoute pas "page" à la requête puisqu'il est par défaut à 1
    if (nbrPage !== 1) searchURL += `&page=${nbrPage}`;
    //affiche de base la page de chargement le temps du fetch
    displayLoading();
    fetchAPI(searchURL);
}

/**
 * visuel d'un chargement le temps du fetch
 */
function displayLoading() {
    let loading = ` <div class="ms-5">
                        <span class="text-2xl text-center">Recherche en cours...</span>
                        <svg class="size-8 animate-spin inline-block ms-2" viewBox="0 0 100 101" fill="none">
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"
                            />
                        </svg>
                    </div>`;
    $("#displayFilm").empty();
    $("#pagination").empty();
    $(loading).appendTo("#displayFilm");
}

/**
 * fonction d'appelle à l'API et transmet le json
 * @async
 * @param {string} url - url de l'API a fetch
 */
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error problem: ${response.status}`);
        let json = response.json();
        let check = await handlerData(json);
        //regarde si la fonction retourne, si oui c'est une erreur donc on l'envoie au catch
        if (typeof check !== "undefined") throw new Error(`${check}`);
    } catch (error) {
        let errorDisplay = ` <div class="ms-5">
                                <span class="text-2xl text-center">${error.message}</span>
                            </div>`;

        $("#displayFilm").empty();
        $(errorDisplay).appendTo("#displayFilm");
    }
}

/**
 * fonction qui gère les données et les redistribue aux bonnes fonctions
 * @async
 * @param {JSON} json - json give by the API
 * @returns retourn s'il y a une erreur pour la catch et la traiter
 */
async function handlerData(json) {
    let data = await json;

    if (data.Response == "True") {
        //divise le résultat par dix car dix résultats donnés par l'api à chaque "page" et arrondi au supérieur car si 8 résultats :
        // 8/10 = 0.8 arrondi au dessus : 1
        let nbrPage = Math.ceil(Number(data.totalResults) / 10);

        //si il y a plus d'une page à afficher alors on créée une pagination
        if (nbrPage > 1) pagination(nbrPage);
        displaySearch(data.Search);
    } else {
        return data.Error;
    }
}

/**
 * fonction de pagination
 * @param {number} nbrPage - Le nombre de pages nécessaires à la pagination
 */
function pagination(nbrPage) {
    //supprime toutes les éléments qui seraient présents à la suite d'un changement de page ou d'une nouvelle recherche
    $("#pagination").empty();

    //pagination si il y a plus de 7 pages alors on affiche pas toutes les pages avec l'affichage d'un élément "..."
    if (nbrPage <= 7) {
        for (let i = 1; i <= nbrPage; i++) {
            //on change le premier et dernier élément de la pagination pour correspondre aux bordures
            if (i == nbrPage)
                $(
                    `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-e-md cursor-pointer pagination" type="button" id="${i}">${i}</button>`
                ).appendTo("#pagination");
            else if (i == 1)
                $(
                    `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-s-md border-e cursor-pointer pagination" type="button" id="${i}">${i}</button>`
                ).appendTo("#pagination");
            else
                $(`<button class="buttonPag pagination" type="button" id="${i}">${i}</button>`).appendTo("#pagination");
        }
    } else {
        //on teste pour si il y a besoin de couper les premières et dernières pages aussi et afficher un élément "..."
        if (currentPage > 4 && currentPage < nbrPage - 3) {
            for (let i = currentPage - 4; i <= currentPage + 4; i++) {
                //teste du dernier élément
                if (i == currentPage + 4)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-e-md cursor-pointer pagination" type="button" id="${nbrPage}">${nbrPage}</button>`
                    ).appendTo("#pagination");
                //élément "..."
                else if (i == currentPage + 3)
                    $(
                        `<button class="border-e p-1 px-4 bg-neutral-200 pagination" type="button" disabled>...</button>`
                    ).appendTo("#pagination");
                //élément "..."
                else if (i == currentPage - 3)
                    $(
                        `<button class="border-e p-1 px-4 bg-neutral-200 pagination" type="button" disabled>...</button>`
                    ).appendTo("#pagination");
                //première élément
                else if (i == currentPage - 4)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-s-md border-e cursor-pointer pagination" type="button" id="1">1</button>`
                    ).appendTo("#pagination");
                else
                    $(`<button class="buttonPag pagination" type="button" id="${i}">${i}</button>`).appendTo(
                        "#pagination"
                    );
            }
            //on teste pour couper uniquement les premières
        } else if (currentPage >= nbrPage - 3) {
            for (let i = currentPage - 4; i <= nbrPage; i++) {
                if (i == nbrPage)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-e-md cursor-pointer pagination" type="button" id="${nbrPage}">${nbrPage}</button>`
                    ).appendTo("#pagination");
                else if (i == currentPage - 3)
                    $(
                        `<button class="border-e p-1 px-4 bg-neutral-200 pagination" type="button" disabled>...</button>`
                    ).appendTo("#pagination");
                else if (i == currentPage - 4)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-s-md border-e cursor-pointer pagination" type="button" id="1">1</button>`
                    ).appendTo("#pagination");
                else
                    $(`<button class="buttonPag pagination" type="button" id="${i}">${i}</button>`).appendTo(
                        "#pagination"
                    );
            }
        } else {
            for (let i = 1; i <= 7; i++) {
                if (i == 7)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-e-md cursor-pointer pagination" type="button" id="${nbrPage}">${nbrPage}</button>`
                    ).appendTo("#pagination");
                else if (i == 6)
                    $(
                        `<button class="border-e p-1 px-4 bg-neutral-200 pagination" type="button" disabled>...</button>`
                    ).appendTo("#pagination");
                else if (i == 1)
                    $(
                        `<button class="px-4 p-1 hover:bg-neutral-300 bg-neutral-200 rounded-s-md border-e cursor-pointer pagination" type="button" id="${i}">${i}</button>`
                    ).appendTo("#pagination");
                else
                    $(`<button class="buttonPag pagination" type="button" id="${i}">${i}</button>`).appendTo(
                        "#pagination"
                    );
            }
        }
    }
    $(`#${currentPage}`).addClass("selectedPage").attr("disabled", true);
    $(".pagination").on("click", function () {
        //change la variable pour correspondre à la page que l'on va choisir
        currentPage = Number($(this).attr("id"));
        //rappelle avec comme entrée la page cliquée
        searchFilm(currentPage);
    });
}

/**
 * afficher les films du résultat de la recherche
 * @param {Array} search - tableau avec tous les films de la recherche
 */
function displaySearch(search) {
    let films = search;
    let elementHtml = films
        .map(
            (elem) => `<div
                            class="flex flex-col items-center bg-linear-to-tl from-cyan-950 from-20% to-teal-600/80 p-5 rounded-2xl gap-2 shadow-2xl shadow-black w-[370px]"
                        >
                            <img
                                class="rounded-2xl shadow-xl shadow-black/50 w-[300px] poster"
                                src=${elem.Poster}
                                alt=${elem.Title}
                            />
                            <h3 class="font-bold text-center">${elem.Title}</h3>
                            <small class="italic text-lg">${elem.Year}</small>
                        </div>`
        )
        .join("");
    $("#displayFilm").empty();
    $(elementHtml).appendTo("#displayFilm");
    //change l'image en un placeholder si il ne trouve pas le poster du film
    $(".poster").on("error", function () {
        $(this).attr("src", "/public/image/No-Image-Placeholder.svg");
    });
}
/* ----------------------------------------------------- Script ----------------------------------------------------- */

$("#buttonSearch").on("click", function () {
    currentPage = 1;
    searchFilm(currentPage);
});

//animation
logo();
