import { Contest } from '@prisma/client';

export const getAllContests = async (): Promise<Contest[]> => {
  return fetch('/api/get-all-contests', {
    method: 'GET'
  })
    .then(async (response) => await response.json())
    .then((response) => {
      if (response.status < 300) {
        throw new Error(response.error.message);
      }

      return response;
    });
};
