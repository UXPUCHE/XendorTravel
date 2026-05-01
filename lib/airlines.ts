// ==============================
// AIRLINES LIST (para selects)
// ==============================

export const AIRLINES = [
  { code: 'AM', name: 'Aeroméxico' },
  { code: 'AR', name: 'Aerolíneas Argentinas' },
  { code: 'AV', name: 'Avianca' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AC', name: 'Air Canada' },
  { code: 'UX', name: 'Air Europa' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DM', name: 'Arajet' },
  { code: 'O4', name: 'Andes Líneas Aéreas' },
  { code: 'OB', name: 'BoA (Boliviana de Aviación)' },
  { code: 'CM', name: 'Copa Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'EK', name: 'Emirates' },
  { code: 'ET', name: 'Ethiopian Airlines' },
  { code: 'FO', name: 'Flybondi' },
  { code: 'G3', name: 'GOL' },
  { code: 'IB', name: 'Iberia' },
  { code: 'AZ', name: 'ITA Airways' },
  { code: 'JA', name: 'JetSMART' },
  { code: 'KL', name: 'KLM' },
  { code: 'LA', name: 'LATAM Airlines' },
  { code: 'JJ', name: 'LATAM Brasil' },
  { code: 'LP', name: 'LATAM Perú' },
  { code: 'XL', name: 'LATAM Chile' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'ZP', name: 'Paranair' },
  { code: 'H2', name: 'Sky Airline' },
  { code: 'LX', name: 'SWISS' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'UA', name: 'United Airlines' },
]

// ==============================
// LOGOS (IMPORTADOS)
// ==============================

const AR = '/airlines/AR.svg'
const AA = '/airlines/AA.svg'
const AC = '/airlines/AC.svg'
const AM = '/airlines/AM.svg'
const AV = '/airlines/AV.svg'
const AZ = '/airlines/AZ.svg'
const BA = '/airlines/BA.svg'
const CM = '/airlines/CM.svg'
const DL = '/airlines/DL.svg'
const EK = '/airlines/EK.svg'
const ET = '/airlines/ET.svg'
const FO = '/airlines/FO.svg'
const G3 = '/airlines/G3.svg'
const H2 = '/airlines/H2.svg'
const IB = '/airlines/IB.svg'
const JA = '/airlines/JA.svg'
const JJ = '/airlines/JJ.svg'
const KL = '/airlines/KL.svg'
const LA = '/airlines/LA.svg'
const LH = '/airlines/LH.svg'
const LP = '/airlines/LP.svg'
const LX = '/airlines/LX.svg'
const O4 = '/airlines/O4.svg'
const TK = '/airlines/TK.svg'
const UA = '/airlines/UA.svg'
const UX = '/airlines/UX.svg'
const XL = '/airlines/XL.svg'
const ZP = '/airlines/ZP.svg'
const OB = '/airlines/OB.svg'
const DM = '/airlines/DM.svg'

// ==============================
// MAPA DE LOGOS
// ==============================

export const AIRLINE_LOGOS: Record<string, any> = {
  AR,
  AA,
  AC,
  AM,
  AV,
  AZ,
  BA,
  CM,
  DL,
  EK,
  ET,
  FO,
  G3,
  H2,
  IB,
  JA,
  JJ,
  KL,
  LA,
  LH,
  LP,
  LX,
  O4,
  TK,
  UA,
  UX,
  XL,
  ZP,
  OB,
  DM,
}

// ==============================
// HELPER
// ==============================

export const getAirlineLogo = (code?: string | null) => {
  if (!code) return null
  return AIRLINE_LOGOS[code.toUpperCase().trim()] || null
}