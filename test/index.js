import { Rect } from "./../src/type/Rect.js";
import { canvasVerbal } from "../src/vo/CanvasVerbal.js";
const big = document.getElementById("big");
const cv = canvasVerbal("asdf", 800, 800, { "background-color": "#ccc" }, big);
// const cv2 = canvasVerbal("234", 800, 800, { "background-color": "blue" }, big!);
const test = new Rect({
    width: 100,
    height: 100,
    left: 20,
    top: 20,
    styleInfo: { fill: "blue", "border-size": 4 },
});
console.log(test);
cv.addObject(test);
cv.render();
