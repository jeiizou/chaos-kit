/**
 * @chaos-kit/functional
 */

interface FUNCTOR {
    map(fn: any): any;
}

/**
 * 定义函子
 */
export class Functor implements FUNCTOR {
    static of(value: any): Functor {
        return new Functor(value);
    }

    public value: any;
    constructor(value: any) {
        this.value = value;
    }

    map(fn: any): any {
        return Functor.of(fn(this.value));
    }
}

/**
 * Maybe 函子: 空值过滤
 */
export class Maybe extends Functor {
    map(fn: any) {
        return this.value ? Maybe.of(fn(this.value)) : Maybe.of(null);
    }
}

/**
 * Either 函子: 逻辑判断
 */
export class Either implements FUNCTOR {
    private static of(left: any, right: any): Either {
        return new Either(left, right);
    }
    right: any;
    left: any;

    constructor(left: any, right: any) {
        this.left = left;
        this.right = right;
    }

    map(fn: any) {
        return this.right
            ? Either.of(this.left, fn(this.right))
            : Either.of(fn(this.left), this.right);
    }
}

/**
 * AP 函子: 函数函子
 */
export class Ap extends Functor {
    ap(F: Functor) {
        return Ap.of(this.value(F.value));
    }
}

/**
 * Monad 函子: 总是返回一个单层的函子
 */
export class Monad extends Functor {
    join() {
        return this.value;
    }

    flatMap(fn: any) {
        return this.map(fn).join();
    }
}
