import { Contest } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getLatestContest = async (
  ac: AbortController
): Promise<Contest> => {
  return fetch('/api/get-latest-contest', {
    signal: ac.signal,
    method: 'GET'
  })
    .then(responseHandler)
    .catch((error) => {
      if (ac.signal.aborted) return;
      throw error;
    });
};
