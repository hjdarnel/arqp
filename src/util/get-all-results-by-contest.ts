import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getAllResultsByContest = async (
  ac: AbortController,
  contestId: string
): Promise<Submission[]> => {
  return fetch(
    '/api/get-all-results-by-contest?' +
      new URLSearchParams({
        contestId
      }),
    { signal: ac.signal }
  )
    .then(responseHandler)
    .catch((error) => {
      if (error.name === 'AbortError') return;
    });
};
