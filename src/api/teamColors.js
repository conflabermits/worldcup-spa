export const TEAM_COLORS = {
  USA: '#0A3161',
  MEX: '#006847',
  CAN: '#FF0000',
  BRA: '#009c3b',
  ARG: '#75aadb',
  FRA: '#002395',
  ENG: '#ce1124',
  GER: '#dd0000',
  ESP: '#ad1519',
  POR: '#006600',
  ITA: '#0064a8',
  NED: '#f36c21',
  BEL: '#e30613',
  CRO: '#ff0000',
  URU: '#0038a8',
  COL: '#fcd116',
  JPN: '#000555',
  KOR: '#c60c30',
  SEN: '#00853f',
  MAR: '#c1272d',
  SUI: '#FF0000',
  DEN: '#C60C30',
  POL: '#DC143C',
  AUS: '#FFCD00',
  KSA: '#006C35',
  ECU: '#FFDD00',
  QAT: '#8A1538',
  GHA: '#006B3F',
  CMR: '#007A5E',
  SRB: '#C6363C',
  WAL: '#00BA40',
  CRC: '#CE1126',
  IRN: '#239F40'
};

export function getTeamColor(abbreviation) {
  return TEAM_COLORS[abbreviation] || 'rgba(255, 255, 255, 0.1)';
}
