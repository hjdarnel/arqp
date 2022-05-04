import { Contest } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const getContest = async (): Promise<Contest> => {
  return fetch('/api/get-contest', {
    method: 'GET'
  }).then(responseHandler);
};
