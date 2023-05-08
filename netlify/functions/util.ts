import { cabrilloToObject } from 'cabrillo';
import { AuditLog, Contest } from '@prisma/client';

export const parse = async (
  body,
  currentContest: Contest
): Promise<Omit<AuditLog, 'id' | 'created_at'>> => {
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

  if (
    (!parsed?.QSO || parsed?.QSO?.length === 0) &&
    (!parsed?.Qso || parsed?.Qso?.length === 0)
  ) {
    throw new Error('Unable to parse QSO records from body');
  }
  console.log(`Parsed ${parsed.QSO?.length ?? parsed.Qso.length} QSO records`);
  console.info({ ...parsed, QSO: 'omitted' });

  return {
    contestId: currentContest.id,
    email: body.email,
    callsign: body.callsign,
    category: body.category,
    contestLocation: body.location,
    multipleOperators: body.multipleOperators === 'true',
    assistance: body.assistance === 'true',
    name: parsed.NAME,
    club: parsed.CLUB,
    claimedScore: Number.parseInt(body.claimedScore),
    logScore:
      Number.parseInt(parsed['CLAIMED-SCORE']) ??
      Number.parseInt(parsed['claimed-score']),
    logLocation: parsed.LOCATION,
    logEmail: parsed.EMAIL,
    logOperator:
      parsed['CATEGORY-OPERATOR']?.split('-')[0].toUpperCase() ??
      parsed['Category-Operator'].split('-')[0].toUpperCase(),
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
    logFile: null
  };
};
