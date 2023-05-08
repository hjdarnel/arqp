import { Handler } from '@netlify/functions';
import Busboy from 'busboy';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import { parse } from './util';

if (
  !process.env.AWS_S3_BUCKET_NAME ||
  !process.env.AWS_S3_ACCESS_KEY_ID ||
  !process.env.AWS_S3_SECRET_ACCESS_KEY
) {
  throw new Error('Missing env variables');
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

const prisma = new PrismaClient();

enum Location {
  'AR - Arkansas' = 'AR - Arkansas',
  'AR - Ashley' = 'AR - Ashley',
  'AR - Baxter' = 'AR - Baxter',
  'AR - Benton' = 'AR - Benton',
  'AR - Boone' = 'AR - Boone',
  'AR - Bradley' = 'AR - Bradley',
  'AR - Calhoun' = 'AR - Calhoun',
  'AR - Carroll' = 'AR - Carroll',
  'AR - Chicot' = 'AR - Chicot',
  'AR - Clark' = 'AR - Clark',
  'AR - Clay' = 'AR - Clay',
  'AR - Cleburne' = 'AR - Cleburne',
  'AR - Cleveland' = 'AR - Cleveland',
  'AR - Columbia' = 'AR - Columbia',
  'AR - Conway' = 'AR - Conway',
  'AR - Craighead' = 'AR - Craighead',
  'AR - Crawford' = 'AR - Crawford',
  'AR - Crittenden' = 'AR - Crittenden',
  'AR - Cross' = 'AR - Cross',
  'AR - Dallas' = 'AR - Dallas',
  'AR - Desha' = 'AR - Desha',
  'AR - Drew' = 'AR - Drew',
  'AR - Faulkner' = 'AR - Faulkner',
  'AR - Franklin' = 'AR - Franklin',
  'AR - Fulton' = 'AR - Fulton',
  'AR - Garland' = 'AR - Garland',
  'AR - Grant' = 'AR - Grant',
  'AR - Greene' = 'AR - Greene',
  'AR - Hempstead' = 'AR - Hempstead',
  'AR - Hot Spring' = 'AR - Hot Spring',
  'AR - Howard' = 'AR - Howard',
  'AR - Independence' = 'AR - Independence',
  'AR - Izard' = 'AR - Izard',
  'AR - Jackson' = 'AR - Jackson',
  'AR - Jefferson' = 'AR - Jefferson',
  'AR - Johnson' = 'AR - Johnson',
  'AR - Lafayette' = 'AR - Lafayette',
  'AR - Lawrence' = 'AR - Lawrence',
  'AR - Lee' = 'AR - Lee',
  'AR - Lincoln' = 'AR - Lincoln',
  'AR - Little River' = 'AR - Little River',
  'AR - Logan' = 'AR - Logan',
  'AR - Lonoke' = 'AR - Lonoke',
  'AR - Madison' = 'AR - Madison',
  'AR - Marion' = 'AR - Marion',
  'AR - Miller' = 'AR - Miller',
  'AR - Mississippi' = 'AR - Mississippi',
  'AR - Monroe' = 'AR - Monroe',
  'AR - Montgomery' = 'AR - Montgomery',
  'AR - Nevada' = 'AR - Nevada',
  'AR - Newton' = 'AR - Newton',
  'AR - Ouachita' = 'AR - Ouachita',
  'AR - Perry' = 'AR - Perry',
  'AR - Phillips' = 'AR - Phillips',
  'AR - Pike' = 'AR - Pike',
  'AR - Poinsett' = 'AR - Poinsett',
  'AR - Polk' = 'AR - Polk',
  'AR - Pope' = 'AR - Pope',
  'AR - Prairie' = 'AR - Prairie',
  'AR - Pulaski' = 'AR - Pulaski',
  'AR - Randolph' = 'AR - Randolph',
  'AR - St. Francis' = 'AR - St. Francis',
  'AR - Saline' = 'AR - Saline',
  'AR - Scott' = 'AR - Scott',
  'AR - Searcy' = 'AR - Searcy',
  'AR - Sebastian' = 'AR - Sebastian',
  'AR - Sevier' = 'AR - Sevier',
  'AR - Sharp' = 'AR - Sharp',
  'AR - Stone' = 'AR - Stone',
  'AR - Union' = 'AR - Union',
  'AR - Van Buren' = 'AR - Van Buren',
  'AR - Washington' = 'AR - Washington',
  'AR - White' = 'AR - White',
  'AR - Woodruff' = 'AR - Woodruff',
  'AR - Yell' = 'AR - Yell',
  'Alabama' = 'Alabama',
  'Alaska' = 'Alaska',
  'Arizona' = 'Arizona',
  'California' = 'California',
  'Colorado' = 'Colorado',
  'Connecticut' = 'Connecticut',
  'Delaware' = 'Delaware',
  'Florida' = 'Florida',
  'Georgia' = 'Georgia',
  'Hawaii' = 'Hawaii',
  'Idaho' = 'Idaho',
  'Illinois' = 'Illinois',
  'Indiana' = 'Indiana',
  'Iowa' = 'Iowa',
  'Kansas' = 'Kansas',
  'Kentucky' = 'Kentucky',
  'Louisiana' = 'Louisiana',
  'Maine' = 'Maine',
  'Maryland' = 'Maryland',
  'Massachusetts' = 'Massachusetts',
  'Michigan' = 'Michigan',
  'Minnesota' = 'Minnesota',
  'Mississippi' = 'Mississippi',
  'Missouri' = 'Missouri',
  'Montana' = 'Montana',
  'Nebraska' = 'Nebraska',
  'Nevada' = 'Nevada',
  'New Hampshire' = 'New Hampshire',
  'New Jersey' = 'New Jersey',
  'New Mexico' = 'New Mexico',
  'New York' = 'New York',
  'North Carolina' = 'North Carolina',
  'North Dakota' = 'North Dakota',
  'Ohio' = 'Ohio',
  'Oklahoma' = 'Oklahoma',
  'Oregon' = 'Oregon',
  'Pennsylvania' = 'Pennsylvania',
  'Rhode Island' = 'Rhode Island',
  'South Carolina' = 'South Carolina',
  'South Dakota' = 'South Dakota',
  'Tennessee' = 'Tennessee',
  'Texas' = 'Texas',
  'Utah' = 'Utah',
  'Vermont' = 'Vermont',
  'Virginia' = 'Virginia',
  'Washington' = 'Washington',
  'West Virginia' = 'West Virginia',
  'Wisconsin' = 'Wisconsin',
  'Wyoming' = 'Wyoming',
  'Newfoundland' = 'Newfoundland',
  'Prince Edward Island' = 'Prince Edward Island',
  'Nova Scotia' = 'Nova Scotia',
  'New Brunswick' = 'New Brunswick',
  'Quebec' = 'Quebec',
  'Ontario' = 'Ontario',
  'Manitoba' = 'Manitoba',
  'Saskatchewan' = 'Saskatchewan',
  'Alberta' = 'Alberta',
  'British Columbia' = 'British Columbia',
  'Yukon-NWT' = 'Yukon-NWT',
  'DX' = 'DX'
}

enum Category {
  'DX' = 'DX',
  'Digital' = 'Digital',
  'Mobile Inside Arkansas' = 'Mobile Inside Arkansas',
  'Mobile Outside Arkansas' = 'Mobile Outside Arkansas',
  'Multi Operator' = 'Multi Operator',
  'Portable Inside Arkansas' = 'Portable Inside Arkansas',
  'Portable Outside Arkansas' = 'Portable Outside Arkansas',
  'Rover' = 'Rover',
  'Single Operator High Power, Mixed' = 'Single Operator High Power, Mixed',
  'Single Operator Low Power, Mixed' = 'Single Operator Low Power, Mixed',
  'Single Operator QRP, Mixed' = 'Single Operator QRP, Mixed',
  'Single Operator High Power, All CW' = 'Single Operator High Power, All CW',
  'Single Operator Low Power, All CW' = 'Single Operator Low Power, All CW',
  'Single Operator High Power, All SSB' = 'Single Operator High Power, All SSB',
  'Single Operator Low Power, All SSB' = 'Single Operator Low Power, All SSB'
}

interface Submission {
  file: {
    content: string;
    filename: {
      filename: string;
    };
  };
  callsign: string;
  email: string;
  category: Category;
  location: Location;
  assistance: string;
  multipleOperators: string;
  contestId: string;
  claimedScore: string;
}

const parseMultipartForm = (event): Promise<Submission> => {
  return new Promise((resolve) => {
    const fields = {};

    const busboy = Busboy({
      headers: event.headers
    });

    busboy.on('file', (fieldname, filestream, filename, _, mimeType) => {
      filestream.on('data', (data) => {
        fields[fieldname] = {
          content: data,
          filename,
          type: mimeType
        };
      });
    });

    busboy.on('field', (fieldName, value) => {
      fields[fieldName] = value;
    });

    busboy.on('finish', () => {
      resolve(fields as Submission);
    });

    busboy.write(Buffer.from(event.body, 'base64').toString('utf8'));
  });
};

const handler: Handler = async (event, context) => {
  try {
    const currentContest = await prisma.contest.findFirst({
      where: { timeStart: { lt: new Date() }, timeEnd: { gte: new Date() } }
    });

    if (!currentContest) throw new Error('No contest currently running!');

    if (event.httpMethod !== 'POST') return { statusCode: 404 };
    if (!event.body) throw new Error('Missing request body');

    const body = await parseMultipartForm(event);
    if (!body.file || !body.file.content || !body.file.filename)
      throw new Error('Missing required file');
    console.log('Received request', { ...body, file: 'omitted' });

    if (!body.email) throw new Error('Missing email!');
    if (!body.callsign) throw new Error('Missing callsign!');
    if (!body.category || !Object.values(Category).includes(body.category))
      throw new Error('Missing Category!');
    if (!body.location || !Object.values(Location).includes(body.location))
      throw new Error('Missing location!');
    if (!body.claimedScore) throw new Error('Missing score!');

    const data = await parse(body, currentContest);

    const uploaded = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `${currentContest.title.replace(/\s/g, '_')}/${
          body.callsign
        }-${Date.now()}-${body.file.filename.filename}`,
        Body: body.file.content,
        ACL: 'public-read'
      })
      .promise();

    data.logFile = uploaded.Location;
    console.log(uploaded.Location);

    const [, created] = await prisma.$transaction([
      prisma.auditLog.create({ data }),
      prisma.submission.upsert({
        create: data,
        update: data,
        where: {
          callsign_contestId: {
            callsign: data.callsign,
            contestId: data.contestId
          }
        }
      })
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(created)
    };
  } catch (err: any) {
    console.error(err.message);
    const message = err.message;
    const statusCode = 400;

    if (process.env.NODE_ENV === 'development') {
      return {
        statusCode,
        body: JSON.stringify({ error: { message } })
      };
    }

    if (
      err.message.includes('Invalid body') ||
      err.message.includes('Missing request body') ||
      err.message.includes('Missing required file')
    ) {
      return {
        statusCode,
        body: JSON.stringify({ error: { message } })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'Error submitting results.' } })
    };
  }
};

export { handler };
