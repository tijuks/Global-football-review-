
import { League, Nation, TabDefinition, RealtimeCategory } from './types';

export const APP_TITLE = "Global Football Review Hub";

export const GEMINI_MODEL_NAME = 'gemini-3-flash-preview';

export const LEAGUES: League[] = [
  { id: 'epl', name: 'Premier League', promptFocus: 'the English Premier League (EPL)', type: 'league', confederation: 'UEFA', isPopular: true },
  { id: 'laliga', name: 'La Liga', promptFocus: 'Spain\'s La Liga', type: 'league', confederation: 'UEFA', isPopular: true },
  { id: 'serie_a', name: 'Serie A', promptFocus: 'Italy\'s Serie A', type: 'league', confederation: 'UEFA', isPopular: true },
  { id: 'bundesliga', name: 'Bundesliga', promptFocus: 'Germany\'s Bundesliga', type: 'league', confederation: 'UEFA', isPopular: true },
  { id: 'ligue1', name: 'Ligue 1', promptFocus: 'France\'s Ligue 1', type: 'league', confederation: 'UEFA', isPopular: true },
  { id: 'eredivisie', name: 'Eredivisie', promptFocus: 'the Dutch Eredivisie', type: 'league', confederation: 'UEFA', isPopular: false },
  { id: 'primeira_liga', name: 'Primeira Liga', promptFocus: 'Portugal\'s Primeira Liga', type: 'league', confederation: 'UEFA', isPopular: false },
  { id: 'mls', name: 'Major League Soccer', promptFocus: 'the American MLS', type: 'league', confederation: 'CONCACAF', isPopular: true },
  { id: 'brasileirao', name: 'Brasileirão', promptFocus: 'Brazil\'s Serie A (Brasileirão)', type: 'league', confederation: 'CONMEBOL', isPopular: true },
  { id: 'arg_primera', name: 'Argentine Primera', promptFocus: 'Argentine Primera División', type: 'league', confederation: 'CONMEBOL', isPopular: false },
  { id: 'saudi_pro', name: 'Saudi Pro League', promptFocus: 'Saudi Pro League', type: 'league', confederation: 'AFC', isPopular: true },
  { id: 'j_league', name: 'J1 League', promptFocus: 'Japan\'s J1 League', type: 'league', confederation: 'AFC', isPopular: false },
  { id: 'serie_b', name: 'Serie B', promptFocus: 'Italy\'s Serie B', type: 'league', confederation: 'UEFA', isPopular: false },
  { id: 'serie_c', name: 'Serie C', promptFocus: 'Italy\'s Serie C (Lega Pro)', type: 'league', confederation: 'UEFA', isPopular: false },
  { 
    id: 'others', 
    name: 'Other Leagues', 
    promptFocus: 'other notable football leagues globally, focusing on major talking points or standout teams/players.',
    type: 'league',
    isPopular: false
  },
];

export const NATIONS: Nation[] = [
    // CONMEBOL
    { id: 'arg', name: 'Argentina', countryCode: 'AR', promptFocus: 'the Argentinian national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'bra', name: 'Brazil', countryCode: 'BR', promptFocus: 'the Brazilian national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'uru', name: 'Uruguay', countryCode: 'UY', promptFocus: 'the Uruguayan national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'col', name: 'Colombia', countryCode: 'CO', promptFocus: 'the Colombian national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'chi', name: 'Chile', countryCode: 'CL', promptFocus: 'the Chilean national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'ecu', name: 'Ecuador', countryCode: 'EC', promptFocus: 'the Ecuadorian national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'par', name: 'Paraguay', countryCode: 'PY', promptFocus: 'the Paraguayan national football team', confederation: 'CONMEBOL', type: 'nation' },
    { id: 'per', name: 'Peru', countryCode: 'PE', promptFocus: 'the Peruvian national football team', confederation: 'CONMEBOL', type: 'nation' },

    // UEFA
    { id: 'eng', name: 'England', countryCode: 'GB-ENG', promptFocus: 'the English national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'fra', name: 'France', countryCode: 'FR', promptFocus: 'the French national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'ger', name: 'Germany', countryCode: 'DE', promptFocus: 'the German national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'ita', name: 'Italy', countryCode: 'IT', promptFocus: 'the Italian national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'esp', name: 'Spain', countryCode: 'ES', promptFocus: 'the Spanish national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'por', name: 'Portugal', countryCode: 'PT', promptFocus: 'the Portuguese national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'ned', name: 'Netherlands', countryCode: 'NL', promptFocus: 'the Dutch national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'bel', name: 'Belgium', countryCode: 'BE', promptFocus: 'the Belgian national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'cro', name: 'Croatia', countryCode: 'HR', promptFocus: 'the Croatian national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'den', name: 'Denmark', countryCode: 'DK', promptFocus: 'the Danish national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'sui', name: 'Switzerland', countryCode: 'CH', promptFocus: 'the Swiss national football team', confederation: 'UEFA', type: 'nation' },
    { id: 'tur', name: 'Turkey', countryCode: 'TR', promptFocus: 'the Turkish national football team', confederation: 'UEFA', type: 'nation' },

    // CAF
    { id: 'sen', name: 'Senegal', countryCode: 'SN', promptFocus: 'the Senegalese national football team', confederation: 'CAF', type: 'nation' },
    { id: 'mar', name: 'Morocco', countryCode: 'MA', promptFocus: 'the Moroccan national football team', confederation: 'CAF', type: 'nation' },
    { id: 'nga', name: 'Nigeria', countryCode: 'NG', promptFocus: 'the Nigerian national football team', confederation: 'CAF', type: 'nation' },
    { id: 'egy', name: 'Egypt', countryCode: 'EG', promptFocus: 'the Egyptian national football team', confederation: 'CAF', type: 'nation' },
    { id: 'gha', name: 'Ghana', countryCode: 'GH', promptFocus: 'the Ghanaian national football team', confederation: 'CAF', type: 'nation' },
    { id: 'civ', name: 'Ivory Coast', countryCode: 'CI', promptFocus: 'the Ivorian national football team', confederation: 'CAF', type: 'nation' },
    { id: 'cmr', name: 'Cameroon', countryCode: 'CM', promptFocus: 'the Cameroonian national football team', confederation: 'CAF', type: 'nation' },
    { id: 'alg', name: 'Algeria', countryCode: 'DZ', promptFocus: 'the Algerian national football team', confederation: 'CAF', type: 'nation' },

    // AFC
    { id: 'jpn', name: 'Japan', countryCode: 'JP', promptFocus: 'the Japanese national football team', confederation: 'AFC', type: 'nation' },
    { id: 'kor', name: 'South Korea', countryCode: 'KR', promptFocus: 'the South Korean national football team', confederation: 'AFC', type: 'nation' },
    { id: 'aus', name: 'Australia', countryCode: 'AU', promptFocus: 'the Australian national football team (Socceroos)', confederation: 'AFC', type: 'nation' },
    { id: 'irn', name: 'Iran', countryCode: 'IR', promptFocus: 'the Iranian national football team', confederation: 'AFC', type: 'nation' },
    { id: 'ksa', name: 'Saudi Arabia', countryCode: 'SA', promptFocus: 'the Saudi Arabian national football team', confederation: 'AFC', type: 'nation' },
    { id: 'qat', name: 'Qatar', countryCode: 'QA', promptFocus: 'the Qatari national football team', confederation: 'AFC', type: 'nation' },

    // CONCACAF
    { id: 'usa', name: 'USA', countryCode: 'US', promptFocus: 'the United States men\'s national soccer team (USMNT)', confederation: 'CONCACAF', type: 'nation' },
    { id: 'mex', name: 'Mexico', countryCode: 'MX', promptFocus: 'the Mexican national football team', confederation: 'CONCACAF', type: 'nation' },
    { id: 'can', name: 'Canada', countryCode: 'CA', promptFocus: 'the Canadian men\'s national soccer team', confederation: 'CONCACAF', type: 'nation' },
    { id: 'crc', name: 'Costa Rica', countryCode: 'CR', promptFocus: 'the Costa Rican national football team', confederation: 'CONCACAF', type: 'nation' },
    { id: 'jam', name: 'Jamaica', countryCode: 'JM', promptFocus: 'the Jamaican national football team (Reggae Boyz)', confederation: 'CONCACAF', type: 'nation' },

    // OFC
    { id: 'nzl', name: 'New Zealand', countryCode: 'NZ', promptFocus: 'the New Zealand national football team (All Whites)', confederation: 'OFC', type: 'nation' },
];

export const REALTIME_CATEGORIES: RealtimeCategory[] = [
  { id: 'live', name: 'Live Matches', promptFocus: 'live or very recently finished key football matches happening right now globally', type: 'realtime' },
  { id: 'upcoming', name: 'Upcoming Matches', promptFocus: 'major upcoming football matches in the next 24-48 hours', type: 'realtime' },
  { id: 'previous', name: 'Previous Matches', promptFocus: 'recently completed key football matches from around the world from the last 24 hours', type: 'realtime' },
];

export const TABS: TabDefinition[] = [
  { id: 'review', label: 'Review' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'insights', label: 'Insights' },
  { id: 'tactics', label: 'Tactics' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'performance', label: 'Performance Data' },
  { id: 'betting', label: 'Betting Strategy' },
];
