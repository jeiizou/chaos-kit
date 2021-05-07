/**
 * 异步逻辑控制
 */

/**
 * 所有promise都成功了就调用回调
 * @returns
 */
export function allSuccess(asyncQueue: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        let answers: any[] = [];
        for (let i = 0; i < asyncQueue.length; i++) {
            const task = asyncQueue[i];
            task.then(value => {
                answers[i] = value;
            }).catch(err => {
                reject(err);
            });
        }
        resolve(answers);
    });
}

/**
 * 所有promise完成了就调用回调
 * @returns
 */
export function allSettled(asyncQueue: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        let answers: any[] = [];
        for (let i = 0; i < asyncQueue.length; i++) {
            const task = asyncQueue[i];
            task.then(value => {
                answers[i] = value;
            }).catch(err => {
                answers[i] = undefined;
            });
        }
        resolve(answers);
    });
}

/**
 * 一个promise成功了就调用回调
 * @returns
 */
export function onceSuccess(asyncQueue: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < asyncQueue.length; i++) {
            const task = asyncQueue[i];
            task.then(value => {
                resolve(value);
            });
        }
    });
}

/**
 * 一个promise完成了就调用回调
 * @returns
 */
export function onceSettled(asyncQueue: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < asyncQueue.length; i++) {
            const task = asyncQueue[i];
            task.then(value => {
                resolve(value);
            }).catch(error => {
                resolve(error);
            });
        }
    });
}

export function onceFailed(asyncQueue: Promise<any>[]) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < asyncQueue.length; i++) {
            const task = asyncQueue[i];
            task.catch(error => {
                resolve(error);
            });
        }
    });
}

// TODO: 异步迭代
export function forEach() {}

// TODO: 并发线程控制
export function asyncPool() {}
