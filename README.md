# CanvasVerbal

_Learn about a semi-finished event system implemented in canvas.If you like it, you can help with the rest of the work._

```
    import { Rect } from "./../src/type/Rect.js";
    import { canvasVerbal } from "../src/vo/CanvasVerbal.js";
    const big = document.getElementById("big")!;
    const cv = canvasVerbal("asdf", 800, 800, { "background-color": "#ccc" }, big);

    const test1 = new Rect(
    { width: 100, height: 100, left: 20, top: 40 },
    { fill: "red", border_size: 10, border_color: "green" }
    );

    const test2 = new Rect(
    { width: 100, height: 100, left: 300, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );

    const test3 = new Rect(
    { width: 100, height: 100, left: 300, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );

    const test4 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );
    const test5 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );
    const test6 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );
    const test7 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );
    const test8 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );
    const test9 = new Rect(
    { width: 100, height: 100, left: 500, top: 20 },
    { fill: "blue", border_size: 10, border_color: "green" }
    );

    cv.addObject(test1);
    cv.addObject(test2)
    .addObject(test3)
    .addObject(test4)
    .addObject(test5)
    .addObject(test6);
    cv.render();
```

![image](https://user-images.githubusercontent.com/122962161/235107176-d9c647bf-0746-4d41-885e-ba6d153d3375.png)
