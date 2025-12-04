/* ------------------------------------------------------------------------------------------------------------------ */
/*                                           Technologie : js natif + jquery                                          */
/* ------------------------------------------------------------------------------------------------------------------ */

"use strict";

import $ from "jquery";
import { films } from "./app";

/* ---------------------------------------------------- Variables --------------------------------------------------- */
let tabFilm = films;
let timeoutNotif;
/* ---------------------------------------------------- Functions --------------------------------------------------- */

//modifie la première lettre en capitale
function uppercaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//Affiche les films dans le tableau
function displayFilm() {
    $("#displayFilm").empty();
    //on crée les éléments un par un et on utilise a méthode "text()" pour éviter l'injection dans notre site
    tabFilm.forEach((elem, i) => {
        $("#displayFilm").append(`<tr id="line${i}"></tr>`);
        $(`#line${i}`)
            .append($("<td class='shell'></td>").text(elem.title))
            .append($(`<td class="shell"></td>`).text(elem.years))
            .append($(`<td class="shellEnd"></td>`).text(elem.authors))
            .append(
                $(`<td class="shellEnd text-end">
                            <button class="bg-red-900 w-10 rounded-lg p-1 transition duration-300 ease-in-out border border-red-900 hover:bg-neutral-200/80 hover:text-red-900 cursor-pointer deleteFilm" id="buttonLine${i}" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <g stroke="currentColor" fill="currentColor">
                                        <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/>
                                    </g>
                                </svg>
                            </button>
                        </td>`)
            );
    });
    //appelle la fonction pour générer un listener à chaque nouvelle création de bouton "supprimer"
    deleteFilm();
}

//Ajoute les listeners sur les boutons pour rajouter des films dans la liste, et selon le résultat du teste affiche le message d'ajout ou refus
//du form et si validé ajoute le nouveau film
function addFilm() {
    $("#buttonAddFilm").on("click", function () {
        $(this).addClass("hidden");
        $("#inputAddFilm").removeClass("hidden").addClass("flex");
    });
    $("#buttonSaveFilm").on("click", function () {
        let resultCheck = checkAddFilm();
        if (resultCheck[1]) {
            //supprime l'ancien timeout si nouvelle tentative (permet d'enchaîner les validations des input)
            if (typeof timeoutNotif !== undefined) clearTimeout(timeoutNotif);
            //supprime une notif
            $(".notif").remove();
            //affiche le message avec l'html que checkAddFilm lui renvoie
            $(resultCheck[0])
                .addClass(
                    "fixed top-10 left-1/2 -translate-x-1/2 border border-white/30 rounded-xl w-fit text-center text-teal-400 text-lg z-10 bg-teal-900/90 p-3 notif"
                )
                .appendTo("body");
            $("#inputAddFilm").removeClass("flex").addClass("hidden");
            $("#buttonAddFilm").removeClass("hidden");
            //ajoute le nouveau film avec ses props dans le tableau
            tabFilm.push({
                title: uppercaseFirstLetter($("#title").val()),
                years: Number($("#years").val()),
                //sépare l'input en deux s'il y a un nom et prénom et met en majuscule la première lettre de chaque
                authors: $("#authors")
                    .val()
                    .split(" ")
                    .map((elem) => uppercaseFirstLetter(elem))
                    .join(" "),
            });
            //appelle la fonction pour afficher le tableau modifié
            displayFilm();
            //timer de 3sec au bout duquel le message se supprime
            setTimeout(() => $(".notif").remove(), 3000);
        } else {
            if (typeof timeoutNotif !== undefined) clearTimeout(timeoutNotif);
            $(".notif").remove();
            $(`<ul><p class="mb-2">Erreur dans le formulaire :</p>${resultCheck[0]}</ul>`)
                .addClass(
                    "fixed top-10 left-1/2 -translate-x-1/2 border border-white/30 rounded-xl w-fit text-center text-red-600 text-lg z-10 bg-red-900/90 p-3 notif"
                )
                .appendTo("body");
            setTimeout(() => $(".notif").remove(), 8000);
        }
    });
}
//vérifie si le form est bien rempli et retourne un tableau comme si : ["html à afficher", booléen]
function checkAddFilm() {
    let returnTab = ["", true];
    let today = new Date();

    //série de tests, ajoute l'erreur dans un li si l'entrée ne correspond pas
    if (!($("#title").val().length >= 2)) {
        returnTab[0] += "<li>Le titre doit faire au moins 2 caractères</li>";
        returnTab[1] = false;
    }
    if (!(Number($("#years").val()) >= 1900 && Number($("#years").val()) <= today.getFullYear())) {
        returnTab[0] += `<li>L'année doit être comprise entre 1900 et ${today.getFullYear()}</li>`;
        returnTab[1] = false;
    }
    if (!($("#authors").val().length >= 5)) {
        returnTab[0] += "<li>L'auteur doit faire au moins 5 caractères</li>";
        returnTab[1] = false;
    }
    //si tous les tests sont réussis, modifie l'html pour indiquer le succès du check
    if (returnTab[1] === true) returnTab[0] = "<p>Film ajouter avec succès</p>";

    return returnTab;
}

//trie les films selon le titre (ordre alphabétique) ou l'année (ordre décroissant)
function sortFilm() {
    $("#filtre").on("change", function () {
        switch ($(this).val()) {
            case "title":
                tabFilm.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "years":
                tabFilm.sort((a, b) => b.years - a.years);
                break;
        }
        displayFilm();
    });
}

//supprime le film associé au bouton
function deleteFilm() {
    $(".deleteFilm").on("click", function () {
        let id = $(this).attr("id");
        let notifDisplay = `<div class="absolute z-20 w-full h-full top-0 bg-white/30" id="notifConf">
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-950 p-5 border-2 border-teal-600 rounded-xl"
            >
                <p class="text-xl p-3">Voulez-vous vraiment supprimer ?</p>
                <button
                    class="p-2 float-left bg-neutral-200/50 rounded-lg cursor-pointer transition duration-100 ease-in-out hover:bg-neutral-200/30"
                    type="button"
                    id="confCancel"
                >
                    Annuler
                </button>
                <button
                    class="float-right p-2 bg-red-800 rounded-lg cursor-pointer transition duration-100 ease-in-out hover:bg-red-900"
                    type="button"
                    id="confDelete"
                >
                    Supprimer
                </button>
            </div>
        </div>`;

        //notif pour confirmer la suppression
        $(notifDisplay).appendTo("body");
        $("#confCancel").on("click", function () {
            $("#notifConf").remove();
        });
        $("#confDelete").on("click", function () {
            $("#notifConf").remove();
            //récupère le numéro dans l'id du bouton, ex: "buttonLine0" => "0"
            id = id.charAt(id.length - 1);
            tabFilm.splice(Number(id), 1);
            displayFilm();
        });
    });
}
/* ----------------------------------------------------- Script ----------------------------------------------------- */

displayFilm();
addFilm();
sortFilm();
