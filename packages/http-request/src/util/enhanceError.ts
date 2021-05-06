function enhanceError(
    error: Error,
    config: any,
    code?: number | string | null,
    request?: any,
    response?: any,
) {
    let enhancedError: any = error;
    enhancedError.config = config;
    if (code) {
        enhancedError.code = code;
    }
    enhancedError.request = request;
    enhancedError.response = response;
    enhancedError.isHttpRequestError = true;
    enhancedError.toJSON = function toJSON() {
        return {
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Http-request
            config: this.config,
            code: this.code,
        };
    };

    return enhancedError;
}

function createError(
    message: string,
    config: any,
    code?: number | string | null,
    request?: any,
    response?: any,
) {
    let error = new Error(message);
    return enhanceError(error, config, code, request, response);
}

export default createError;
