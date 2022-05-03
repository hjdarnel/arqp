import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const timeStart = new Date();
    const timeEnd = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );

    const created = await prisma.contest.create({
      data: {
        title: `Test Contest ${Date.now()}`,
        timeStart,
        timeEnd
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ created })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 50,
      body: JSON.stringify({ err })
    };
  }
};

export { handler };
