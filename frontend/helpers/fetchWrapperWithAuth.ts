import { accountService, UserState } from '../services';
import { fetchWrapper } from './fetchWrapper';

function createWrapper(fn) {
  return function fetchWithAuth<T>(...args) {
    return new Promise<T>((resolve) => {
      const subscription = accountService.status.subscribe((status) => {
        if (status !== UserState.UNDEFINED) callFn();
      });

      function callFn() {
        resolve(fn(...args));
        subscription?.unsubscribe();
      }
    });
  };
}

export const fetchWrapperWithAuth = {
  get: createWrapper(fetchWrapper.get),
  post: createWrapper(fetchWrapper.post),
  put: createWrapper(fetchWrapper.put),
  delete: createWrapper(fetchWrapper.delete)
};
