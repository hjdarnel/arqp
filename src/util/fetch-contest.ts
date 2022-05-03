import { Contest } from '@prisma/client';

export const getContest = async (): Promise<Contest> => {
  return fetch('/api/get-contest', {
    method: 'GET'
  }).then(async (response) => await response.json());
};
