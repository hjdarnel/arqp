import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const alphanum = /^[a-zA-Z0-9]+$/;
    const contestId = event.queryStringParameters['contestId'];
    const callsign = event.queryStringParameters['callsign'];

    if (!contestId || !alphanum.test(contestId)) {
      return {
        statusCode: 400,
        body: `Invalid contest id ${contestId}`
      };
    }
    if (!callsign || !alphanum.test(callsign)) {
      return {
        statusCode: 400,
        body: `Invalid callsign id ${callsign}`
      };
    }

    const result = await prisma.submission.findMany({
      where: {
        contestId: event.queryStringParameters['contestId'],
        callsign: {
          contains: event.queryStringParameters['callsign'],
          mode: 'insensitive'
        }
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
      body:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error getting result.'
    };
  }
};

export { handler };
