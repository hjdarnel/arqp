import { cabrilloToObject } from 'cabrillo';
import { Handler } from '@netlify/functions';
import Busboy from 'busboy';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface Submission {
  file?: {
    content: string;
    filename: {
      filename: string;
    };
  };
  callsign?: string;
  email?: string;
  power?: string;
  assistance?: string;
  multipleOperators?: string;
  contestId?: string;
  claimedScore?: string;
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
      resolve(fields);
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
    if (!body?.file) throw new Error('Missing required file');
    console.log('Received request', { ...body, file: 'omitted' });

    let parsed;
    try {
      const cabrillo = Buffer.from(body.file.content, 'base64').toString();
      parsed = cabrilloToObject(cabrillo, { contest: 'NAQP' });
    } catch (err) {
      throw new Error('Cannot parse file as Cabrillo log. Is it a valid log?');
    }

    Object.entries(parsed).map(([key, value]) => {
      if (key === 'QSO') return (parsed[key] = value);
      if (typeof value === 'string')
        return (parsed[key] = value.replace('\r', ''));
      return (parsed[key] = value);
    });

    if (!parsed?.QSO || parsed?.QSO?.length === 0) {
      throw new Error('Unable to parse QSO records from body');
    }
    console.log(`Parsed ${parsed.QSO.length} QSO records`);
    console.info({ ...parsed, QSO: 'omitted' });

    const created = await prisma.submission.create({
      data: {
        contestId: currentContest.id,
        email: body.email,
        callsign: body.callsign,
        power: body.power,
        multipleOperators: body.multipleOperators === 'true',
        assistance: body.assistance === 'true',
        name: parsed.NAME,
        club: parsed.CLUB,
        claimedScore: Number.parseInt(body.claimedScore),
        location: parsed.LOCATION,
        logEmail: parsed.EMAIL,
        logOperator: parsed['CATEGORY-OPERATOR'].split('-')[0],
        logStation: parsed['CATEGORY-STATION'],
        logTransmitter: parsed['CATEGORY-TRANSMITTER'],
        logPower: parsed['CATEGORY-POWER'],
        logAssisted: parsed['CATEGORY-ASSISTED'] === 'ASSISTED',
        logBand: parsed['CATEGORY-BAND'],
        logMode: parsed['CATEGORY-MODE']
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(created)
    };
  } catch (err: any) {
    console.error(err.message);
    let message = err.message;
    let statusCode = 500;

    if (process.env.NODE_ENV === 'development') {
      return {
        statusCode,
        body: JSON.stringify({ error: { message } })
      };
    }

    if (err.message.includes('Unique constraint failed on the constraint')) {
      return {
        statusCode,
        body: JSON.stringify({
          error: {
            message:
              'Invalid submission, only one submission allowed per callsign per contest.'
          }
        })
      };
    }

    return {
      statusCode,
      body: JSON.stringify({ error: { message: 'Error submitting results.' } })
    };
  }
};

export { handler };
