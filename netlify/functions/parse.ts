import { cabrilloToObject } from 'cabrillo';
import { writeToBuffer } from '@fast-csv/format';
import { Handler } from '@netlify/functions';
import Busboy from 'busboy';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
    if (event.httpMethod !== 'POST') return { statusCode: 404 };
    if (!event.body) throw new Error('Missing request body');

    const body = await parseMultipartForm(event);
    if (!body?.file) throw new Error('Missing required file');
    console.log('Received request', { ...body, file: 'omitted' });

    const cabrillo = Buffer.from(body.file.content, 'base64').toString();
    let parsed = cabrilloToObject(cabrillo, { contest: 'NAQP' });

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
        contestId: body.contestId,
        email: body.email,
        callsign: body.callsign,
        power: body.power,
        multipleOperators: body.multipleOperators === 'true',
        assistance: body.assistance === 'true',
        name: parsed.name,
        club: parsed.club,
        claimedScore: Number.parseInt(parsed['CLAIMED-SCORE']),
        location: parsed.location,
        logEmail: parsed.logEmail,
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
    // const csv = await writeToBuffer(parsed.QSO, { headers: true });

    // return {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'text/csv',
    //     'Content-Disposition': `attachment; filename="${body.file.filename.filename.replace(
    //       /\.[^/.]+$/,
    //       ''
    //     )}.csv"`
    //   },
    //   statusCode: 200,
    //   body: csv.toString('base64'),
    //   isBase64Encoded: true
    // };
  } catch (err: any) {
    console.error(err.message);

    return {
      statusCode: 500,
      body:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error processing file.'
    };
  }
};

export { handler };
