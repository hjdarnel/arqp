import type { AuditLog, Contest } from '@prisma/client';
import { cabrilloToObject } from 'cabrillo';
import type { Category } from '~/util/categories';
import type { Location } from '~/util/locations';

export const parse = async (
  body: {
    callsign: string;
    email: string;
    score: number;
    category: Category;
    location: Location;
    multipleOperators: boolean;
    file: Blob;
  },
  currentContest: Contest,
): Promise<Omit<AuditLog, 'id' | 'created_at'>> => {
  type CabrilloLog = {
    QSO?: Record<string, unknown>[];
    Qso?: Record<string, unknown>[];
    'Claimed-Score'?: string;
    'CLAIMED-SCORE'?: string;
    'CATEGORY-OPERATOR'?: string;
    'Category-Operator'?: string;
    'CATEGORY-STATION'?: string;
    'Category-Station'?: string;
    'CATEGORY-TRANSMITTER'?: string;
    'Category-Transmitter'?: string;
    'CATEGORY-POWER'?: string;
    'Category-Power'?: string;
    'CATEGORY-ASSISTED'?: string;
    'CATEGORY-BAND'?: string;
    'Category-Band'?: string;
    'CATEGORY-MODE'?: string;
    'Category-Mode'?: string;
    [key: string]: unknown;
  };

  let parsed: CabrilloLog;
  try {
    parsed = cabrilloToObject(await body.file.text(), {
      contest: 'NAQP',
    });
  } catch (err) {
    console.error(err);
    throw new Error('Cannot parse file as Cabrillo log. Is it a valid log?');
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      parsed[key] = value.trim().replace('\r', '');
    } else parsed[key] = value;
  }
  console.log(JSON.stringify(parsed, null, 2));

  if (!parsed.QSO?.length && !parsed.Qso?.length) {
    throw new Error('Unable to parse QSO records from body');
  }
  console.log(`Parsed ${parsed.QSO?.length ?? parsed.Qso?.length} QSO records`);
  console.info({ ...parsed, QSO: 'omitted' });

  return {
    contestId: currentContest.id,
    email: body.email,
    callsign: body.callsign,
    category: body.category,
    contestLocation: body.location,
    multipleOperators: body.multipleOperators,
    name: parsed.NAME ?? parsed.Name,
    club: parsed.CLUB ?? parsed.Club,
    claimedScore: body.score,
    logScore: parsed['CLAIMED-SCORE']
      ? Number.parseInt(parsed['CLAIMED-SCORE'])
      : parsed['Claimed-Score']
        ? Number.parseInt(parsed['Claimed-Score'])
        : null,
    logLocation: parsed.LOCATION ?? parsed.Location,
    logEmail: parsed.EMAIL ?? parsed.Email,
    logOperator:
      parsed['CATEGORY-OPERATOR']?.split('-')[0]?.toUpperCase() ??
      parsed['Category-Operator']?.split('-')[0]?.toUpperCase(),
    logStation:
      parsed['CATEGORY-STATION']?.toUpperCase() ??
      parsed['Category-Station']?.toUpperCase(),
    logTransmitter:
      parsed['CATEGORY-TRANSMITTER']?.toUpperCase() ??
      parsed['Category-Transmitter']?.toUpperCase(),
    logPower:
      parsed['CATEGORY-POWER']?.toUpperCase() ??
      parsed['Category-Power']?.toUpperCase(),
    logAssisted:
      (parsed['CATEGORY-ASSISTED']?.toUpperCase() ?? false) === 'ASSISTED',
    logBand:
      parsed['CATEGORY-BAND']?.toUpperCase() ??
      parsed['Category-Band']?.toUpperCase(),
    logMode:
      parsed['CATEGORY-MODE']?.toUpperCase() ??
      parsed['Category-Mode']?.toUpperCase(),
  } as Omit<AuditLog, 'id' | 'created_at'>;
};
