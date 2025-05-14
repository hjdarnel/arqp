import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
import { writeToBuffer } from '@fast-csv/format';

const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const contestId = event.queryStringParameters?.['contestId'];

    if (!contestId) throw new Error('Missing required parameter contestId');

    const contest = await prisma.contest.findUnique({
      where: { id: event.queryStringParameters?.['contestId'] }
    });

    if (!contest)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: {
            message: `No contest found for id ${event.queryStringParameters?.['contestId']}`
          }
        })
      };

    const submissions = await prisma.submission.findMany({
      where: { contestId: event.queryStringParameters?.['contestId'] }
    });

    const csv = await writeToBuffer(submissions, { headers: true });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${contest.title}.csv"`
      },
      statusCode: 200,
      body: csv.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err: any) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message:
            process.env.NODE_ENV === 'development'
              ? err.message
              : 'Unable to retrieve contest.'
        }
      })
    };
  }
};

export { handler };
