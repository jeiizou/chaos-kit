export class AsyncPool {
    pendingQueue: { fn: () => Promise<any>; resolve: (value: any) => void }[] =
        [];
    curExecQueue: Promise<any>[] = [];
    constructor(private maxLength: number) {}

    add(
        taskRunner: () => Promise<any>,
        preResolve?: (value: any) => void,
    ): Promise<any> {
        if (!taskRunner) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            if (this.curExecQueue.length < this.maxLength) {
                // instantiation promise
                let p = taskRunner().then(value => {
                    if (!preResolve) {
                        resolve(value);
                    } else {
                        preResolve(value);
                    }

                    this.curExecQueue.splice(this.curExecQueue.indexOf(p), 1);
                    if (this.pendingQueue.length > 0) {
                        let nextTask = this.pendingQueue.splice(0, 1)[0];
                        this.add(nextTask.fn, nextTask.resolve);
                    }
                });
                this.curExecQueue.push(p);
            } else {
                this.pendingQueue.push({
                    fn: taskRunner,
                    resolve: resolve,
                });
            }
        });
    }
}
