import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getResult = async (
  contestId: string,
  callsign: string
): Promise<Submission[]> => {
  return fetch(
    '/api/get-result-by-call?' +
      new URLSearchParams({
        contestId,
        callsign
      })
  ).then(responseHandler);
};
