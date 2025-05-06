'use server';
import type { Contest } from '@prisma/client';
import { db } from './db';

export const getAllContests = async (): Promise<Contest[]> =>
  await db.contest
    .findMany({
      orderBy: { timeStart: 'desc' }
    })
    .catch((err) => {
      console.error('Error fetching all contests:', err);
      return [];
    });

export const getActiveContest = async (): Promise<Contest | null> =>
  await db.contest
    .findFirst({
      where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
    })
    .catch((err) => {
      console.error('Error fetching active contest:', err);
      return null;
    });

export const getLatestContest = async (): Promise<Contest | null> =>
  await db.contest
    .findFirst({
      where: {
        timeStart: { lt: new Date() }
      },
      orderBy: { timeEnd: 'desc' },
      take: 1
    })
    .catch((err) => {
      console.error('Error fetching latest contest:', err);
      return null;
    });
