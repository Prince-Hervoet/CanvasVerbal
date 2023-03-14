class Point {
  x: number;
  y: number;
}

class Edge {
  point1: Point;
  point2: Point;
}

export class VOElement {
  // id
  id: string;
  // name
  name: string;
  // 是否是基础类型
  isBaseShapeType: boolean;
  // 类型名
  shapeType: string;
  // 包围盒左上角x
  boundingBox_x1: number;
  // 包围盒左上角y
  boundingBox_y1: number;
  // 包围盒右下角x
  boundingBox_x2: number;
  // 包围盒右下角y
  boundingBox_y2: number;
  // 其他信息
  info: any;
  // 边信息
  edges: Edge[];
  // 如果是圆形
  center: Point;
  // 半径
  r: number;

  constructor() {}
}
