import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getResult = async (
  ac: AbortController,
  contestId: string,
  callsign: string
): Promise<Submission[]> => {
  return fetch(
    '/api/get-result-by-call?' +
      new URLSearchParams({
        contestId,
        callsign
      }),
    { signal: ac.signal }
  )
    .then(responseHandler)
    .catch((error) => {
      if (error.name === 'AbortError') return;
    });
};
