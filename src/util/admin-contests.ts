import { Contest } from '@prisma/client';

export type AdminContest = Contest & { _count: { submissions: number } };
export type ContestInput = { title: string; timeStart: string; timeEnd: string };

export const ADMIN_TOKEN_KEY = 'arqp-admin-token';

export class UnauthorizedError extends Error {}

const request = async (
  token: string,
  method: string,
  query: string,
  body?: ContestInput
): Promise<any> => {
  const response = await fetch(`/api/admin-contests${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const parsed = await response.json().catch(() => null);
  if (response.status === 401) {
    throw new UnauthorizedError(parsed?.error?.message ?? 'Unauthorized');
  }
  if (!response.ok) {
    throw new Error(parsed?.error?.message ?? `Request failed (${response.status})`);
  }
  return parsed;
};

export const listContests = (token: string): Promise<AdminContest[]> =>
  request(token, 'GET', '');

export const createContest = (
  token: string,
  input: ContestInput
): Promise<Contest> => request(token, 'POST', '', input);

export const updateContest = (
  token: string,
  id: string,
  input: ContestInput
): Promise<Contest> =>
  request(token, 'PUT', `?${new URLSearchParams({ id })}`, input);

export const deleteContest = (token: string, id: string): Promise<void> =>
  request(token, 'DELETE', `?${new URLSearchParams({ id })}`);
