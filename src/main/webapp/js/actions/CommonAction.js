const server = '.';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const get = function (url) {
  return fetch(`${server}/${url}`, {
    method: 'get',
    headers: defaultHeaders,
  });
};

