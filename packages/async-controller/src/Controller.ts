/**
 * 异步控制器
 */
const defaultControllerConfig = {
    // 最大允许并发数量
    maxConcurrent: 100,
};

export class Controller {
    constructor(private AsyncQueue: Promise<any>[], config: any) {}

    allSuccess() {
        return new Promise((resolve, reject) => {
            let answers: any[] = [];
            for (let i = 0; i < this.AsyncQueue.length; i++) {
                const task = this.AsyncQueue[i];
                task.then(value => {
                    answers[i] = value;
                }).catch(err => {
                    reject(err);
                });
            }
            resolve(answers);
        });
    }

    allSettled() {
        return new Promise((resolve, reject) => {
            let answers: any[] = [];
            for (let i = 0; i < this.AsyncQueue.length; i++) {
                const task = this.AsyncQueue[i];
                task.then(value => {
                    answers[i] = value;
                }).catch(err => {
                    answers[i] = undefined;
                });
            }

            resolve(answers);
        });
    }

    onceSuccess() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.AsyncQueue.length; i++) {
                const task = this.AsyncQueue[i];
                task.then(value => {
                    resolve(value);
                });
            }
        });
    }

    onceSettled() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.AsyncQueue.length; i++) {
                const task = this.AsyncQueue[i];
                task.then(value => {
                    resolve(value);
                }).catch(error => {
                    resolve(error);
                });
            }
        });
    }

    onceFailed() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.AsyncQueue.length; i++) {
                const task = this.AsyncQueue[i];
                task.catch(error => {
                    resolve(error);
                });
            }
        });
    }
}
