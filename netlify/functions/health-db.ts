import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  const response = await prisma.$runCommandRaw({ ping: 1 });

  return {
    statusCode: response.ok ? 200 : 500,
    body: JSON.stringify({ healthy: !!response.ok })
  };
};

export { handler };
