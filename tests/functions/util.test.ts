import { Contest } from '@prisma/client';
import fs from 'fs';
import path from 'path';

import { parse } from '../../netlify/functions/util';

const body = {
  email: 'abc123@gmail.com',
  callsign: 'ABC123',
  category: 'SSB',
  contestLocation: 'AR - Arkansas',
  multipleOperators: false,
  name: 'Henry Darnell',
  club: 'Big Bois',
  claimedScore: 652,
  file: {}
};

describe('snapshot tests', () => {
  it('works on normal input', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/normal.log')
    );

    const result = parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(await result).toMatchSnapshot();
  });

  it('works on lowercase input', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/lower.log')
    );

    const result = parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(await result).toMatchSnapshot();
  });

  it(`doesn't fail`, () => {
    expect(true).toBe(true);
  });
});
