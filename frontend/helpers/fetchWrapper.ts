import getConfig from 'next/config';
import { accountService } from '../services';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
  authHeader,
  handleResponse
};

function get(url) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(url)
  };
  return handleResponse(fetch(url, requestOptions));
}

function post(url, body) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(body)
  };
  return handleResponse(fetch(url, requestOptions));
}

function put(url, body) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    body: JSON.stringify(body)
  };
  return handleResponse(fetch(url, requestOptions));
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(url)
  };
  return handleResponse(fetch(url, requestOptions));
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = accountService.userValue;
  const isLoggedIn = user && user.jwtToken;
  const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.jwtToken}` };
  } else {
    return {};
  }
}

function handleResponse(fetchPromise) {
  return fetchPromise.then((response) =>
    response.text().then((text) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
        // if ([401, 403].includes(response.status)) {
        if ([401, 403].includes(response.status) && accountService.userValue) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          accountService.logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      return data;
    })
  );
}
