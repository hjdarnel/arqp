import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const contests = await prisma.contest.findMany();

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
              : 'Error getting contests.'
        }
      })
    };
  }
};

export { handler };
