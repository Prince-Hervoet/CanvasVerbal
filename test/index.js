import { Rect } from "./../code/type/Rect.js";
import { canvasVerbal } from "../code/vo/CanvasVerbal.js";
const big = document.getElementById("big");
const cv = canvasVerbal("asdf", 800, 800, { "background-color": "#ccc" }, big);
// const cv2 = canvasVerbal("234", 800, 800, { "background-color": "blue" }, big!);
const test = new Rect({
    width: 100,
    height: 100,
    left: 20,
    top: 20,
});
console.log(test);
cv.addObject(test);
cv.render();
