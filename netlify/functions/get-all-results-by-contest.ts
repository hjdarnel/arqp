import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const result = await prisma.submission.findMany({
      where: {
        contestId: event.queryStringParameters['contestId']
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
              : `Unable to retrieve results for contest ${event.queryStringParameters['contestId']}.`
        }
      })
    };
  }
};

export { handler };
