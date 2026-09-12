export type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const ZODIAC_SIGNS: ZodiacSign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export interface ZodiacDegree {
  sign: ZodiacSign;
  signIndex: number;
  degree: number;
  minute: number;
  second: number;
  decimalInSign: number;
  absoluteLongitude: number;
}

export function normalizeLongitude(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function decimalToZodiac(longitude: number): ZodiacDegree {
  const absoluteLongitude = normalizeLongitude(longitude);
  const signIndex = Math.floor(absoluteLongitude / 30);
  const decimalInSign = absoluteLongitude % 30;
  const degree = Math.floor(decimalInSign);
  const minuteFloat = (decimalInSign - degree) * 60;
  const minute = Math.floor(minuteFloat);
  const second = Math.round((minuteFloat - minute) * 60);
  return { sign: ZODIAC_SIGNS[signIndex], signIndex, degree, minute, second, decimalInSign, absoluteLongitude };
}

export function zodiacToDecimal(sign: ZodiacSign, degree: number, minute = 0, second = 0): number {
  const signIndex = ZODIAC_SIGNS.indexOf(sign);
  if (signIndex < 0) throw new Error(`Unknown zodiac sign: ${sign}`);
  return normalizeLongitude(signIndex * 30 + degree + minute / 60 + second / 3600);
}
