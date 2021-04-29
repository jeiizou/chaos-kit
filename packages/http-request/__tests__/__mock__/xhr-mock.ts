const defaultConfig = {
    // 返回参数
    data: {},
    // 返回状态
    readyState: 4,
    // 状态码
    status: 200,
};

type ConfigType = Partial<typeof defaultConfig>;

function factoryMockXHR(xhrState?: ConfigType) {
    let defaultXHRState = Object.assign(defaultConfig, xhrState);

    return class mockXHR {
        constructor() {}
        readyState = defaultXHRState.readyState;
        status = defaultXHRState.status;
        open = jest.fn();
        setRequestHeader = jest.fn();
        response = defaultXHRState.data;
        send = sendData => {
            setTimeout(() => {
                this.onreadystatechange();
                this.curSendData = sendData;
            }, 0);
        };
        onreadystatechange = jest.fn();
        curSendData: '';
    };
}

const oldXMLHttpRequest = window.XMLHttpRequest;

export function injectXHRMock(options?: ConfigType) {
    //@ts-ignore
    window.XMLHttpRequest = factoryMockXHR(options);
}

export function resumeXHRMock() {
    //@ts-ignore
    window.XMLHttpRequest = oldXMLHttpRequest;
}
