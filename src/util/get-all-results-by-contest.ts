import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getAllResultsByContest = async (
  contestId: string
): Promise<Submission[]> => {
  return fetch(
    '/api/get-all-results-by-contest?' +
      new URLSearchParams({
        contestId
      })
  ).then(responseHandler);
};
