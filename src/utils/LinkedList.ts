class Item {
  next: any;
  prev: any;
  data: any;
  constructor(data: any, prev?: any, next?: any) {
    this.next = next;
    if (next) next.prev = this;
    this.prev = prev;
    if (prev) prev.next = this;
    this.data = data;
  }
}

export class LinkedList {
  #head: any;
  #tail: any;
  #next: any;
  #length: any = 0;
  #current: any;

  constructor() {}

  get head() {
    return this.#head && this.#head.data;
  }

  get tail() {
    return this.#tail && this.#tail.data;
  }

  get current() {
    return this.#current && this.#current.data;
  }

  get length() {
    return this.#length;
  }

  public push(data: any) {
    this.#tail = new Item(data, this.#tail);
    if (this.#length === 0) {
      this.#head = this.#tail;
      this.#current = this.#head;
      this.#next = this.#head;
    }
    this.#length++;
  }

  public pop() {
    const tail = this.#tail;
    if (this.#length === 0) {
      return;
    }
    this.#length--;
    if (this.#length === 0) {
      this.#head = this.#tail = this.#current = this.#next = undefined;
      return tail.data;
    }
    this.#tail = tail.prev;
    this.#tail.next = undefined;
    if (this.#current === tail) {
      this.#current = this.#tail;
      this.#next = undefined;
    }
    return tail.data;
  }

  public shift() {
    if (this.#length === 0) {
      return;
    }

    const head = this.#head;

    this.#length--;
    if (this.#length === 0) {
      this.#head = this.#tail = this.#current = this.#next = undefined;
      return head.data;
    }

    this.#head = this.#head.next;
    if (this.#current === head) {
      this.#current = this.#head;
      this.#next = this.#current.next;
    }

    return head.data;
  }

  public unshift(data: any) {
    this.#head = new Item(data, undefined, this.#head);
    if (this.#length === 0) {
      this.#tail = this.#head;
      this.#next = this.#head;
    }
    this.#length++;
  }

  public unshiftCurrent() {
    const current = this.#current;
    if (current === this.#head || this.#length < 2) {
      return current && current.data;
    }
    // remove
    if (current === this.#tail) {
      this.#tail = current.prev;
      this.#tail.next = undefined;
      this.#current = this.#tail;
    } else {
      current.next.prev = current.prev;
      current.prev.next = current.next;
      this.#current = current.prev;
    }
    this.#next = this.#current.next;
    // unshift
    current.next = this.#head;
    current.prev = undefined;
    this.#head.prev = current;
    this.#head = current;
    return current.data;
  }

  public removeCurrent() {
    const current = this.#current;
    if (this.#length === 0) {
      return;
    }
    this.#length--;
    if (this.#length === 0) {
      this.#head = this.#tail = this.#current = this.#next = undefined;
      return current.data;
    }
    if (current === this.#tail) {
      this.#tail = current.prev;
      this.#tail.next = undefined;
      this.#current = this.#tail;
    } else if (current === this.#head) {
      this.#head = current.next;
      this.#head.prev = undefined;
      this.#current = this.#head;
    } else {
      current.next.prev = current.prev;
      current.prev.next = current.next;
      this.#current = current.prev;
    }
    this.#next = this.#current.next;
    return current.data;
  }

  public resetCursor() {
    this.#current = this.#next = this.#head;
    return this;
  }

  public next() {
    const next = this.#next;
    if (next !== undefined) {
      this.#next = next.next;
      this.#current = next;
      return next.data;
    }
  }

  public forEach(callback: (data: number, index: number) => void) {
    let current = this.#head;
    let index = 0;
    while (current) {
      callback(current.data, index++);
      current = current.next;
    }
  }
}
