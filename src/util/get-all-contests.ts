import { Contest } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getAllContests = async (
  ac: AbortController
): Promise<Contest[]> => {
  return fetch('/api/get-all-contests', {
    signal: ac.signal,
    method: 'GET'
  })
    .then(responseHandler)
    .catch((error) => {
      if (ac.signal.aborted) return;
      throw error;
    });
};
