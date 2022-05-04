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

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: {
            message: 'Submission not found.'
          }
        })
      };
    }

    return {
      statusCode: 200,
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
              : `Unable to retreive result.`
        }
      })
    };
  }
};

export { handler };
