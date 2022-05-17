import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const currentContest = await prisma.contest.findFirst({
      where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
    });

    if (!currentContest) {
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
          body: JSON.stringify({ message: `Current contest not found.` })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(latest)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(currentContest)
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
              : `Unable to retreive contest.`
        }
      })
    };
  }
};

export { handler };
