import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const postSubmission = async (
  formData: FormData
): Promise<Submission> => {
  return fetch('/api/submit', {
    method: 'POST',
    body: formData
  }).then(responseHandler);
};
