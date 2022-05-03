import { Contest } from '@prisma/client';

export const getContestExport = async (contestId: string): Promise<any> => {
  return fetch(
    '/api/export-contest?' +
      new URLSearchParams({
        contestId
      }),
    {
      method: 'GET'
    }
  ).then(async (response) => await response.json());
};
