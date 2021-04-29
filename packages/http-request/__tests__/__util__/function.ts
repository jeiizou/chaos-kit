export function sleep(timeStamp: number): Promise<number> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(timeStamp);
        }, timeStamp);
    });
}
