import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { timeStart: 'desc' }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(contests)
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
              : 'Unable to retrieve all contests.'
        }
      })
    };
  }
};

export { handler };
