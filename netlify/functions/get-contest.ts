import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const currentContest = await prisma.contest.findFirst({
      where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(currentContest)
    };
  } catch (err: any) {
    console.error(err);

    return {
      statusCode: 500,
      body:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error getting contest.'
    };
  }
};

export { handler };
