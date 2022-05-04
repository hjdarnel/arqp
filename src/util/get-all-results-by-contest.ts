import { Submission } from '@prisma/client';

export const getAllResultsByContest = async (
  contestId: string
): Promise<Submission[]> => {
  return fetch(
    '/api/get-all-results-by-contest?' +
      new URLSearchParams({
        contestId
      })
  )
    .then(async (response) => await response.json())
    .then((response) => {
      if (response.status < 300) {
        throw new Error(response.error.message);
      }

      return response;
    });
};
