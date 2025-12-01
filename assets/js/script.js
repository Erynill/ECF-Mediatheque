/* ------------------------------------------------------------------------------------------------------------------ */
/*                                           Technologie : js natif + jquery                                          */
/* ------------------------------------------------------------------------------------------------------------------ */

"use strict";

import $ from "jquery";
import { films } from "./app";

/* ---------------------------------------------------- Variables --------------------------------------------------- */
let tabFilm = films;
/* ---------------------------------------------------- Functions --------------------------------------------------- */

//Affiche les films dans le tableau
function displayFilm() {
    let elemDisplay = tabFilm
        .map(
            (elem) => `<tr>
                        <td class="shell">${elem.title}</td>
                        <td class="shell">${elem.years}</td>
                        <td class="shellEnd">${elem.authors}</td>
                        <td class="shellEnd text-end"><button type="button">Suppr</button></td>
                    </tr>`
        )
        .join("");

    $("#displayFilm").html(elemDisplay);
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
                title: $("#title").val(),
                years: Number($("#years").val()),
                authors: $("#authors").val(),
            });
            //appelle la fonction pour afficher le tableau modifié
            displayFilm();
            //timer de 3sec au bout duquel le message se supprime
            setTimeout(() => $(".notif").remove(), 3000);
        } else {
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
/* ----------------------------------------------------- Script ----------------------------------------------------- */

displayFilm();
addFilm();
