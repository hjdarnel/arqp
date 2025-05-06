'use server';
import type { Submission } from '@prisma/client';
import type { Category } from '~/util/categories';
import type { Location } from '~/util/locations';
import { db } from './db';

export const getSubmission = async (
  contestId: string,
  callsign: string
): Promise<Submission[] | null> => {
  const alphanum = /^[a-zA-Z0-9]+$/;

  if (!contestId || !alphanum.test(contestId)) {
    throw new Error(`Invalid contest id ${contestId}`);
  }

  if (!callsign || !alphanum.test(callsign)) {
    throw new Error(`Invalid callsign ${callsign}`);
  }

  return await db.submission.findMany({
    where: {
      contestId,
      callsign: {
        contains: callsign,
        mode: 'insensitive'
      }
    }
  });
};

export const getLatestContestSubmissions = async ({
  category,
  location
}: {
  category?: Category;
  location?: Location;
}) => {
  try {
    const latestContest = await db.contest.findFirst({
      where: {
        timeStart: { lt: new Date() }
      },
      orderBy: { timeEnd: 'desc' },
      take: 1
    });

    if (!latestContest) {
      return [];
    }

    return await db.submission.findMany({
      where: {
        contestId: latestContest?.id,
        category,
        contestLocation: location
      }
    });
  } catch (err) {
    console.error('Error fetching latest contest submissions:', err);
    return [];
  }
};
