import { writeToBuffer } from '@fast-csv/format';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Buffer>
) {
  const { contestId } = req.query;

  if (typeof contestId !== 'string')
    throw new Error('Missing required parameter contestId');

  const contest = await db.contest.findUnique({
    where: { id: contestId }
  });

  if (!contest) {
    res.status(404).json({ message: `No contest found for id ${contestId}` });
    return;
  }

  const submissions = await db.submission.findMany({
    where: { contestId }
  });

  const csv = await writeToBuffer(submissions, { headers: true });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${contest.title}.csv"`
  );
  res.status(200).send(csv);
}
