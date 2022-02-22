import { cabrilloToObject } from 'cabrillo';
import { writeToBuffer } from '@fast-csv/format';
import { Handler } from '@netlify/functions';
import Busboy from 'busboy';

const parseMultipartForm = (event) => {
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

    const bodyParsed: any = await parseMultipartForm(event);
    if (!bodyParsed?.file) throw new Error('Missing required file');

    const cabrillo = Buffer.from(bodyParsed.file.content, 'base64').toString();
    const parsed = cabrilloToObject(cabrillo, { contest: 'NAQP' });

    if (!parsed?.QSO || parsed?.QSO?.length === 0) {
      throw new Error('Unable to parse QSO records from body');
    }
    console.log(`Parsed ${parsed.QSO.length} QSO records`);

    const csv = await writeToBuffer(parsed.QSO, { headers: true });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${bodyParsed.file.filename.filename.replace(
          /\.[^/.]+$/,
          ''
        )}.csv"`
      },
      statusCode: 200,
      body: csv.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body:
        process.env.NODE_ENV === 'development'
          ? err.toString()
          : 'Error processing file.'
    };
  }
};

export { handler };
