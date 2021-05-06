export default function settle(
    resolve: Function,
    reject: Function,
    response: MyResponse,
) {
    const validateStatus = response.config.validateStatus;
    if (
        !response.status ||
        !validateStatus ||
        validateStatus(response.status)
    ) {
        resolve(response);
    } else {
        reject('Request failed with status code ' + response.status);
    }
}
