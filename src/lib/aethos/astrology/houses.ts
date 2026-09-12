import type { ZodiacSign } from './signs';
export type HouseSystem = 'whole-sign' | 'placidus' | 'equal';
export interface HouseCusp { house: number; longitude: number; sign: ZodiacSign; confidence: 'disabled' | 'low' | 'medium' | 'high'; }
