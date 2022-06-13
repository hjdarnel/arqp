import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const latest = await prisma.contest.findFirst({
      where: {
        timeStart: { lt: new Date() }
      },
      orderBy: { timeEnd: 'desc' },
      take: 1
    });

    if (!latest) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `No contests found.` })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(latest)
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
              : `Unable to retrieve contest.`
        }
      })
    };
  }
};

export { handler };
