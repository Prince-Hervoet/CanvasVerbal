import { VerbalObject } from "./VerbalObject.js";

//! 节点
class ListNode {
  val: VerbalObject | null = null;
  next: ListNode | null = null;
  front: ListNode | null = null;
}

//! 对象链表类
export class ObjectList {
  public head: ListNode | null = null;
  public tail: ListNode | null = null;
  public size: number = 0;

  constructor() {
    this.head = new ListNode();
    this.tail = this.head;
  }

  public pushBack(object: VerbalObject) {
    if (!object) {
      return;
    }
    const node = new ListNode();
    node.val = object;
    this.tail!.next = node;
    node.front = this.tail;
    this.tail = node;
    this.size += 1;
  }

  public deleteNode(node: ListNode) {
    if (!node || node === this.head) {
      return;
    }
    const next = node.next;
    const front = node.front!;
    front.next = next;
    node.front = null;
    node.next = null;
    if (next) {
      next.front = null;
    }
    this.size -= 1;
  }
}
