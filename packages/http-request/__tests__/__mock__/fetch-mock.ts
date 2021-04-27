const defaultOption = {
    data: {},
};

type Option = Partial<typeof defaultOption>;

function factoryMockFetch(option: Option, successFlag: boolean) {
    const config = Object.assign(defaultOption, option);
    return successFlag
        ? jest.fn((url, requestConfig) =>
              Promise.resolve({
                  json: () =>
                      Promise.resolve({
                          data: config.data,
                          url: url,
                          requestConfig: requestConfig,
                      }),
              }),
          )
        : jest.fn((url, requestConfig) =>
              Promise.reject({
                  data: config.data,
                  url: url,
                  requestConfig: requestConfig,
              }),
          );
}

const oldFetch = window.fetch;

export function mockResolveFetch(options: Option) {
    // @ts-ignore
    window.fetch = factoryMockFetch(options, true);
}

export function mockRejectFetch(options: Option) {
    // @ts-ignore
    window.fetch = factoryMockFetch(options, false);
}

export function resumeFetchMock() {
    window.fetch = oldFetch;
}
