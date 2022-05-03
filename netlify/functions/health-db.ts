import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  try {
    const response = await prisma.$runCommandRaw({ ping: 1 });

    return {
      statusCode: 200,
      body: JSON.stringify({ healthy: !!response.ok })
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
