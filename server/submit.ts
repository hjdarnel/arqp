'use server';

import AWS from 'aws-sdk';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { env } from '~/env';
import { Category } from '~/util/categories';
import { Location } from '~/util/locations';
import { db } from './db';
import { parse } from './parse';

const s3 = new AWS.S3({
  accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY
});

export type FormResponse =
  | { success: true }
  | {
      success: false;
      message: string;
      errors: Record<string, string[]>;
      payload: unknown;
    };

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const SubmissionSchema = z.object({
  callsign: z.string().max(20, {
    message: 'Callsign must be 20 characters or less'
  }),
  email: z.string().email({ message: 'Email address must be valid' }),
  score: z.number().positive({ message: 'Score must be greater than zero' }),
  category: z.nativeEnum(Category, {
    message: 'Category must be valid'
  }),
  location: z.nativeEnum(Location, {
    message: 'Location must be valid'
  }),
  multipleOperators: z.boolean(),
  file: z
    .instanceof(File, { message: 'Log file is required' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Log file must be 5 MB or less'
    )
});

export const submitSubmission = async (unsafeSubmission: unknown) => {
  const validated = SubmissionSchema.safeParse(unsafeSubmission);

  if (!validated.success) {
    let errorMessage = '';
    for (const issue of validated.error.issues.reverse()) {
      errorMessage += `${issue.message}. ${errorMessage}`;
    }

    throw new Error(errorMessage);
  }
  // try {
  const currentContest = await db.contest.findFirst({
    where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
  });
  if (!currentContest) throw new Error('No contest currently running!');

  const data = await parse(validated.data, currentContest);

  const uploaded = await s3
    .upload({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: `${currentContest.title.replace(/\s/g, '_')}/${
        validated.data.callsign
      }-${Date.now()}-${validated.data.file.name}`,
      Body: Buffer.from(await validated.data.file.arrayBuffer()),
      ACL: 'public-read'
    })
    .promise();
  data.logFile = uploaded.Location;

  console.log(uploaded.Location);
  await db.auditLog.create({ data });
  await db.submission.upsert({
    create: data,
    update: data,
    where: {
      callsign_contestId: {
        callsign: data.callsign,
        contestId: data.contestId
      }
    }
  });

  revalidatePath('/');
  // } catch (error: unknown) {
  //   const err = error as Error;
  //   console.error(err.message);
  //   const message = err.message;
  //   const statusCode = 400;
  //   if (process.env.NODE_ENV === 'development') {
  //     return {
  //       statusCode,
  //       body: JSON.stringify({ error: { message } })
  //     };
  //   }
  //   if (
  //     err.message.includes('Invalid body') ||
  //     err.message.includes('Missing request body') ||
  //     err.message.includes('Missing required file')
  //   ) {
  //     return {
  //       statusCode,
  //       body: JSON.stringify({ error: { message } })
  //     };
  //   }
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ error: { message: 'Error submitting results.' } })
  //   };
  // }
};
