'use server';
import type { Contest } from '@prisma/client';
import { db } from './db';

export const getAllContests = async (): Promise<Contest[]> =>
  await db.contest.findMany({
    orderBy: { timeStart: 'desc' }
  });

export const getActiveContest = async (): Promise<Contest | null> =>
  await db.contest.findFirst({
    where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
  });

export const getLatestContest = async (): Promise<Contest | null> =>
  await db.contest.findFirst({
    where: {
      timeStart: { lt: new Date() }
    },
    orderBy: { timeEnd: 'desc' },
    take: 1
  });
