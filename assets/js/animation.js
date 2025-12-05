/**
 * Animation de la page avec animejs
 * @module animation
 */

import { animate, svg } from "animejs";

/**
 * anime le logo en haut à gauche de la page
 */
export function logo() {
    animate(svg.createDrawable(".line"), {
        draw: ["0 0", "0 1", "0 1", "1 1"],
        ease: "inOutQuad",
        duration: 10000,
        loop: true,
    });
}

export function wrongNotif() {
    animate(".notif", {
        translateY: ["0", "105%", "105%", "105%", "105%", "105%", "105%", "105%", "105%", "105%", "105%", "0"],
        ease: "inOut",
        duration: 8000,
    });
}

export function rightNotif() {
    animate(".notif", {
        translateY: ["0", "105%", "105%", "105%", "105%", "105%", "0"],
        ease: "inOut",
        duration: 3000,
    });
}
