import fs from 'node:fs';
import path from 'node:path';
/* eslint-disable @typescript-eslint/no-floating-promises */
import type { Contest } from '@prisma/client';
import { parse } from '../../src/server/parse';
import { Category } from '../../src/util/categories';
import { Location } from '../../src/util/locations';

const body = {
  email: 'abc123@gmail.com',
  callsign: 'ABC123',
  category: Category['Single Operator Low Power, All SSB'],
  location: Location['AR - Baxter'],
  multipleOperators: false,
  name: 'Henry Darnell',
  club: 'Big Bois',
  score: 652,
  file: {},
};

describe('snapshot tests', () => {
  it('works on normal input', async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, '../fixtures/normal.log'),
    );
    const blob = new Blob([buffer]);

    const result = await parse(
      {
        ...body,
        file: blob,
      },
      {
        id: '123',
      } as Contest,
    );

    expect(result).toMatchSnapshot();
  });

  it('works on lowercase input', async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, '../fixtures/lower.log'),
    );
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on padded input', async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, '../fixtures/padded.log'),
    );
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 1', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/1.txt'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 2', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/2.log'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 3', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/3.log'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 4', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/4.cbr'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 5', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/5.txt'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 6', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/6.LOG'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 7', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/7.log'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 8', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/8.log'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 9', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/9.log'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it('works on 10', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/10.txt'));
    const blob = new Blob([buffer]);

    const result = await parse({ ...body, file: blob }, {
      id: '123',
    } as Contest);

    expect(result).toMatchSnapshot();
  });

  it("doesn't work for x-qso", async () => {
    const buffer = fs.readFileSync(
      path.join(__dirname, '../fixtures/x-qso.log'),
    );
    const blob = new Blob([buffer]);

    expect(
      parse({ ...body, file: blob }, {
        id: '123',
      } as Contest),
    ).rejects.toThrow('Unable to parse QSO records from body');
  });

  it(`doesn't fail`, () => {
    expect(true).toBe(true);
  });
});
