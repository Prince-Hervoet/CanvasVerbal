import { VerbalObject } from "./VerbalObject.js";

class ListNode {
  val: VerbalObject | null = null;
  next: ListNode | null = null;
  front: ListNode | null = null;
}

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
}
