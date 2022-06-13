import { Contest } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getActiveContest = async (
  ac: AbortController
): Promise<Contest> => {
  return fetch('/api/get-active-contest', {
    signal: ac.signal,
    method: 'GET'
  })
    .then(responseHandler)
    .catch((error) => {
      if (error.name === 'AbortError') return;
    });
};
