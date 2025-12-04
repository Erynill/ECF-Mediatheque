import { animate, svg, utils } from "animejs";

export function logo() {
    animate(svg.createDrawable(".line"), {
        draw: ["0 0", "0 1", "0 1", "1 1"],
        ease: "inOutQuad",
        duration: 10000,
        loop: true,
    });
}
