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

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on lowercase input', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/lower.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on padded input', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/padded.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 1', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/1.txt')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 2', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/2.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 3', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/3.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 4', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/4.cbr')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 5', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/5.txt')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 6', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/6.LOG')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 7', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/7.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 8', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/8.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 9', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/9.log')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 10', async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/10.txt')
    );

    const result = await parse({ ...body, file: { content } }, {
      id: '123'
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it("doesn't work for x-qso", async () => {
    const content = await fs.readFileSync(
      path.join(__dirname, '../fixtures/x-qso.log')
    );

    expect(
      parse({ ...body, file: { content } }, {
        id: '123'
      } as Contest)
    ).rejects.toThrow('Unable to parse QSO records from body');
  });

  it(`doesn't fail`, () => {
    expect(true).toBe(true);
  });
});
