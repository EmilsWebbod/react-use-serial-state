declare let fetch: (url: any, params: any) => any;

let oldFetch: (url: any, params: any) => any;

interface IFetchProps {
  status: number;
  response: any;
}

export function fetchMock({ status, response }: IFetchProps) {
  oldFetch = fetch;
  fetch = (url: string, params: any) => {
    return {
      url,
      params,
      status,
      json: () => {
        return response;
      },
      text: () => {
        return response;
      }
    };
  };
}

export function fetchReset() {
  if (oldFetch) {
    fetch = oldFetch;
  }
}
