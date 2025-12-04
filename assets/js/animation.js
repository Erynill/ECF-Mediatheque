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
        draw: ["0 0", "0 1", "1 1"],
        ease: "inOutQuad",
        duration: 5000,
        loop: true,
    });
}
