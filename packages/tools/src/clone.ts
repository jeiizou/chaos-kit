import * as Type from './type';

/**
 * 转换为while, 提高性能
 * @param array
 * @param iteratee
 * @returns
 */
function forEach(array: any[], iteratee: any) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

/**
 * 创建新的对象
 * @param target
 * @returns
 */
function getInit(target: Function) {
    const Ctor = target.constructor as typeof Function;
    return new Ctor();
}

/**
 * 克隆 symbol
 * @param target
 * @returns
 */
function cloneSymbol(target: Symbol) {
    return Object(Symbol.prototype.valueOf.call(target));
}

/**
 * 克隆函数
 * @param func
 * @returns
 */
function cloneFunction(func: typeof Function) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

/**
 * 克隆正则
 * @inner
 * @param target
 * @returns
 */
function cloneReg(target: any) {
    const reFlags = /\w*$/;
    const result = new target.constructor(target.source, reFlags.exec(target));
    result.lastIndex = target.lastIndex;
    return result;
}

/**
 * 克隆不可遍历类型
 * @param targe
 * @param type
 * @returns
 */
function cloneOtherType(targe: any, type: string) {
    const Ctor = targe.constructor;
    switch (type) {
        case Type.ELEMENT_TAG.Boolean:
        case Type.ELEMENT_TAG.Number:
        case Type.ELEMENT_TAG.String:
        case Type.ELEMENT_TAG.Error:
        case Type.ELEMENT_TAG.Date:
            return new Ctor(targe);
        case Type.ELEMENT_TAG.Reg:
            return cloneReg(targe);
        case Type.ELEMENT_TAG.Symbol:
            return cloneSymbol(targe);
        case Type.ELEMENT_TAG.Function:
            return cloneFunction(targe);
        default:
            return null;
    }
}

const deepTag = ['Map', 'Set', 'Object', 'Array', 'Arguments'];

/**
 * 深度克隆
 */
function cloneDeep(target: any, map = new WeakMap()) {
    // 如果
    if (!Type.isObject(target)) {
        return target;
    }

    const type = Type.judge(target);
    let cloneTarget: any;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target);
    } else {
        return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
        return target;
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (Type.isSet(target)) {
        target.forEach((value: any) => {
            cloneTarget.add(cloneDeep(value));
        });
        return cloneTarget;
    }

    // 克隆map
    if (Type.isMap(target)) {
        target.forEach((value: any, key: any) => {
            cloneTarget.set(key, cloneDeep(value));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys =
        type === Type.ELEMENT_TAG.Array ? undefined : Object.keys(target);
    forEach(keys || target, (value: any, key: any) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = cloneDeep(target[key], map);
    });

    return cloneTarget;
}

function cloneShallow(origin: any) {
    let clonsetarget = {};
    return Object.defineProperties(
        clonsetarget,
        Object.getOwnPropertyDescriptors(origin),
    );
    return clonsetarget;
}

/**
 * 克隆一个对象
 * @param origin 源对象
 * @param deepFlag 是否深度克隆
 * @returns
 */
export default function clone(origin: any, deepFlag = false) {
    if (deepFlag) {
        return cloneDeep(origin);
    } else {
        return cloneShallow(origin);
    }
}
