import { Handler, HandlerEvent } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
import { createHash, timingSafeEqual } from 'crypto';

const prisma = new PrismaClient();

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const error = (statusCode: number, message: string) =>
  json(statusCode, { error: { message } });

/*
 * Compares the bearer token against ADMIN_TOKEN in constant time. Both sides
 * are hashed first so timingSafeEqual always gets equal-length buffers.
 * Fails closed if ADMIN_TOKEN isn't configured.
 */
const isAuthorized = (event: HandlerEvent): boolean => {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const header =
    event.headers['authorization'] ?? event.headers['Authorization'] ?? '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return false;

  const sha = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(sha(match[1]), sha(expected));
};

type ContestInput = { title: string; timeStart: Date; timeEnd: Date };

const parseContestInput = (raw: string | null): ContestInput | string => {
  let body: any;
  try {
    body = JSON.parse(raw ?? '');
  } catch {
    return 'Request body must be JSON.';
  }

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) return 'Title is required.';

  const timeStart = new Date(body?.timeStart);
  const timeEnd = new Date(body?.timeEnd);
  if (Number.isNaN(timeStart.getTime())) return 'Start time is invalid.';
  if (Number.isNaN(timeEnd.getTime())) return 'End time is invalid.';
  if (timeEnd <= timeStart) return 'End time must be after start time.';

  return { title, timeStart, timeEnd };
};

const isObjectId = (id: string | undefined): id is string =>
  !!id && /^[a-f0-9]{24}$/i.test(id);

const handler: Handler = async (event) => {
  if (!process.env.ADMIN_TOKEN) {
    console.error('ADMIN_TOKEN is not set; refusing admin request.');
    return error(500, 'Admin access is not configured.');
  }
  if (!isAuthorized(event)) return error(401, 'Invalid admin token.');

  const id = event.queryStringParameters?.['id'];

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const contests = await prisma.contest.findMany({
          orderBy: { timeStart: 'desc' },
          include: { _count: { select: { submissions: true } } }
        });
        return json(200, contests);
      }

      case 'POST': {
        const input = parseContestInput(event.body);
        if (typeof input === 'string') return error(400, input);

        const contest = await prisma.contest.create({ data: input });
        return json(201, contest);
      }

      case 'PUT': {
        if (!isObjectId(id)) return error(400, 'Missing or invalid id.');
        const input = parseContestInput(event.body);
        if (typeof input === 'string') return error(400, input);

        const existing = await prisma.contest.findUnique({ where: { id } });
        if (!existing) return error(404, `No contest found for id ${id}`);

        const contest = await prisma.contest.update({
          where: { id },
          data: input
        });
        return json(200, contest);
      }

      case 'DELETE': {
        if (!isObjectId(id)) return error(400, 'Missing or invalid id.');

        const existing = await prisma.contest.findUnique({
          where: { id },
          include: { _count: { select: { submissions: true, auditLog: true } } }
        });
        if (!existing) return error(404, `No contest found for id ${id}`);

        // Never cascade: a contest with logs attached can't be deleted here.
        const { submissions, auditLog } = existing._count;
        if (submissions > 0 || auditLog > 0) {
          return error(
            409,
            `Contest has ${submissions} submission(s) and ${auditLog} audit log entries; refusing to delete.`
          );
        }

        await prisma.contest.delete({ where: { id } });
        return json(200, { id });
      }

      default:
        return error(405, `Method ${event.httpMethod} not allowed.`);
    }
  } catch (err: any) {
    console.error(err);
    return error(
      500,
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Admin request failed.'
    );
  }
};

export { handler };
