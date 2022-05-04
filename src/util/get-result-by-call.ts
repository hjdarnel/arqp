import { Contest, Submission } from '@prisma/client';

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
  )
    .then(async (response) => await response.json())
    .then((response) => {
      if (response.status < 300) {
        throw new Error(response.error.message);
      }

      return response;
    });
};
