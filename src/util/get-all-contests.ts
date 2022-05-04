import { Contest } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getAllContests = async (): Promise<Contest[]> => {
  return fetch('/api/get-all-contests', {
    method: 'GET'
  }).then(responseHandler);
};
