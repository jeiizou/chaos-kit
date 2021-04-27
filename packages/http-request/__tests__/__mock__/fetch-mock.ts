const defaultOption = {
    data: {},
};

function factoryMockFetch(option) {
    const config = Object.assign(defaultOption, option);
    return jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(config.data),
        }),
    );
}

const oldFetch = window.fetch;

export function injectFetchMock(options) {
    // @ts-ignore
    window.fetch = factoryMockFetch(options);
}

export function resumeFetchMock() {
    window.fetch = oldFetch;
}
