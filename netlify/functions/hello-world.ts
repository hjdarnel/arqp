import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
  const created = await prisma.user.create({
    data: { email: 'abc123@gmail.com' }
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: created })
  };
};

export { handler };
