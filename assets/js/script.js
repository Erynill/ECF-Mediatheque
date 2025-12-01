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

//Ajoute les listeners sur les boutons pour rajouter des films dans la liste
function addFilm() {
    $("#buttonAddFilm").on("click", function () {
        $(this).addClass("hidden");
        $("#inputAddFilm").removeClass("hidden").addClass("flex");
        $("#buttonSaveFilm").on("click", function () {
            $("#inputAddFilm").removeClass("flex").addClass("hidden");
            $("#buttonAddFilm").removeClass("hidden");
        });
    });
}

function checkAddFilm() {}
/* ----------------------------------------------------- Script ----------------------------------------------------- */

displayFilm();
addFilm();
