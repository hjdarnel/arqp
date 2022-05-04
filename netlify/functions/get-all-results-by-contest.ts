import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const result = await prisma.submission.findMany({
      where: {
        contestId: event.queryStringParameters['contestId'],
        assistance: false,
        logAssisted: false
      }
    });

    return {
      statusCode: result === null ? 404 : 200,
      body: JSON.stringify(result)
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
              : `Error getting results for contest ${event.queryStringParameters['contestId']}.`
        }
      })
    };
  }
};

export { handler };
