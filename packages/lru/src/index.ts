/**
 * @jeiizou/LRU
 */

class DLinkedNode<T, K> {
    next: DLinkedNode<T, K> | null = null;
    pre: DLinkedNode<T, K> | null = null;
    constructor(public key: T | null = null, public val: K | null = null) {}
}

class DlinkedNodeUtil<T, K> {
    head: DLinkedNode<T, K>;
    tail: DLinkedNode<T, K>;
    constructor() {
        // 初始化双向链表
        this.head = new DLinkedNode();
        this.tail = new DLinkedNode();
        this.head.next = this.tail;
        this.tail.pre = this.head;
    }
    // link opreation
    public addToHead(node: DLinkedNode<T, K>) {
        node.pre = this.head;
        node.next = this.head.next;
        this.head.next!.pre = node;
        this.head.next = node;
    }

    public removeNode(node: DLinkedNode<T, K>) {
        if (node.pre) node.pre.next = node.next;
        if (node.next) node.next.pre = node.pre;
    }

    public moveToHead(node: DLinkedNode<T, K>) {
        this.removeNode(node);
        this.addToHead(node);
    }

    public removeTail() {
        let node = this.tail.pre;
        if (node) this.removeNode(node);
        return node;
    }
}

export default class LRU<T, K> {
    dlink: DlinkedNodeUtil<T, K>;
    cache: Map<T, DLinkedNode<T, K>> = new Map();
    curSize: number = 0;
    constructor(private maxLength: number = 1000) {
        // 初始化双向链表
        this.dlink = new DlinkedNodeUtil();
    }

    // get Value
    public get(key: T): K | null {
        let node = this.cache.get(key);
        if (!node) return null;
        this.dlink.moveToHead(node);
        return node.val as K;
    }

    // set Value
    public set(key: T, value: K) {
        let node = this.cache.get(key);
        if (!node) {
            // 若node不存在, 则创建一个节点, 保存到哈希表和链表的头部
            node = new DLinkedNode(key, value);
            this.cache.set(key, node);
            this.dlink.addToHead(node);
            // 更新当前节点的数据量
            this.curSize++;

            // 如果数量大于上限, 删除其中一个节点
            if (this.curSize > this.maxLength) {
                let node = this.dlink.removeTail();
                if (node) this.cache.delete(node.key as T);
                this.curSize--;
            }
        } else {
            // 如果key存在, 先通过map定位, 然后修改value, 并转移到链表的头部
            node.val = value;
            this.dlink.moveToHead(node);
        }
    }

    // get All key-value
    public getKeys() {
        return this.cache.keys();
    }
}
