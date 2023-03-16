import { Rect } from "./../src/type/Rect.js";
import { canvasVerbal } from "../src/vo/CanvasVerbal.js";
const big = document.getElementById("big")!;
const cv = canvasVerbal("asdf", 800, 800, { "background-color": "#ccc" }, big);
// const cv2 = canvasVerbal("234", 800, 800, { "background-color": "blue" }, big!);

const test1 = new Rect({
  width: 100,
  height: 100,
  left: 20,
  top: 20,
  styleInfo: { fill: "blue", "border-size": 4 },
});

const test2 = new Rect({
  width: 100,
  height: 100,
  left: 300,
  top: 20,
  styleInfo: { fill: "blue", "border-size": 4 },
});
cv.addObject(test1);
cv.addObject(test2);
cv.render();
