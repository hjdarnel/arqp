import { Submission } from '@prisma/client';
import { responseHandler } from './responseHandler';

export const postSubmission = async (
  ac: AbortController,
  formData: FormData
): Promise<Submission> => {
  return fetch('/api/submit', {
    method: 'POST',
    body: formData,
    signal: ac.signal
  })
    .then(responseHandler)
    .catch((error) => {
      if (error.name === 'AbortError') return;
      throw error;
    });
};
