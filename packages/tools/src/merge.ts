import * as Type from './type';

export const defaultMergeOption = {
    // 属性覆盖
    cover: true,
    // 数组对象合并是否需要去重
    unique: false,
    // 源对象没有的属性是否追加
    append: false,
};

const counldMergeType = ['Map', 'Set', 'Array', 'Object'];

/**
 * 合并数组
 * @param target
 * @param origin
 * @param unique
 * @returns
 */
export function mergeArray(
    target: any[],
    origin: any[],
    config = defaultMergeOption,
) {
    if (config.unique) {
        let setArray = new Set(target);
        for (let i = 0; i < origin.length; i++) {
            const item = origin[i];
            setArray.add(item);
        }
        return Array.from(setArray);
    } else {
        return [...target, ...origin];
    }
}

/**
 * 合并Map对象
 * @param target
 * @param origin
 * @param cover
 * @returns
 */
export function mergeMap(
    target: Map<any, any>,
    origin: Map<any, any>,
    config = defaultMergeOption,
) {
    let mergedMap = new Map(target);
    for (const [key, value] of origin.entries()) {
        if (mergedMap.has(key)) {
            if (config.cover) {
                mergedMap.set(key, merge(mergedMap.get(key), value, config));
            }
        } else {
            mergedMap.set(key, value);
        }
    }
    return mergedMap;
}

/**
 * 合并 set 对象
 * @param target
 * @param origin
 * @param cover
 * @returns
 */
export function mergeSet(target: Set<any>, origin: Set<any>) {
    let mergedSet = new Set(target);
    for (let value of origin.keys()) {
        mergedSet.add(value);
    }
    return mergedSet;
}

/**
 * 合并 Object 对象
 * @param target
 * @param origin
 * @param cover
 * @returns
 */
export function mergeObject(
    target: any,
    origin: any,
    config = defaultMergeOption,
) {
    let returnObject: any = {};
    for (const key of Object.keys(target)) {
        returnObject[key] = target[key];
    }
    for (const key of Object.keys(origin)) {
        if (Object.prototype.hasOwnProperty.call(returnObject, key)) {
            if (config.cover) {
                returnObject[key] = merge(
                    returnObject[key],
                    origin[key],
                    config,
                );
            }
        } else {
            returnObject[key] = origin[key];
        }
    }
    return returnObject;
}

/**
 * 合并两个对象
 * @param target
 * @param origin
 * @param config
 */
export default function merge(
    target: any,
    origin: any,
    config = defaultMergeOption,
) {
    // merge option
    config = Object.assign(defaultMergeOption, config);
    const targetType = Type.judge(target);
    const originType = Type.judge(origin);

    if (targetType !== originType || !counldMergeType.includes(targetType)) {
        return config.cover ? origin : target;
    }

    let mergeFunction: any;
    switch (targetType) {
        case Type.ELEMENT_TAG.Array:
            mergeFunction = mergeArray;
            break;
        case Type.ELEMENT_TAG.Map:
            mergeFunction = mergeMap;
            break;
        case Type.ELEMENT_TAG.Set:
            mergeFunction = mergeSet;
            break;
        case Type.ELEMENT_TAG.Object:
            mergeFunction = mergeObject;
            break;
    }

    return mergeFunction ? mergeFunction(target, origin, config) : null;
}
