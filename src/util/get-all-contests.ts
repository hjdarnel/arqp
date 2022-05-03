import { Contest } from '@prisma/client';

export const getAllContests = async (): Promise<Contest[]> => {
  return fetch('/api/get-all-contests', {
    method: 'GET'
  }).then(async (response) => await response.json());
};
