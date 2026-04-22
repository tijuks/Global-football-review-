
import { League, Nation, TabDefinition, RealtimeCategory } from './types';

export const APP_TITLE = "Global Football Review Hub";

export const GEMINI_MODEL_NAME = 'gemini-3-flash-preview';

export const LEAGUES: League[] = [
  { id: 'epl', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League 🏆', promptFocus: 'the English Premier League (EPL)', type: 'league', confederation: 'UEFA', isPopular: true, description: "The world's most-watched league, known for its high intensity, global stars, and historic clubs like Manchester United, Liverpool, and Manchester City." },
  { id: 'laliga', name: '🇪🇸 La Liga 🇪🇸', promptFocus: 'Spain\'s La Liga', type: 'league', confederation: 'UEFA', isPopular: true, description: "Spain's top flight, celebrated for its technical brilliance and the historic rivalry between giants Real Madrid and FC Barcelona." },
  { id: 'serie_a', name: '🇮🇹 Serie A 🇮🇹', promptFocus: 'Italy\'s Serie A', type: 'league', confederation: 'UEFA', isPopular: true, description: "Italy's premier competition, famous for its tactical sophistication, defensive mastery, and legendary clubs like Juventus, AC Milan, and Inter Milan." },
  { id: 'bundesliga', name: '🇩🇪 Bundesliga 🇩🇪', promptFocus: 'Germany\'s Bundesliga', type: 'league', confederation: 'UEFA', isPopular: true, description: "Germany's elite league, renowned for its high-scoring matches, passionate fan culture, and the dominance of Bayern Munich." },
  { id: 'ligue1', name: '🇫🇷 Ligue 1 🇫🇷', promptFocus: 'France\'s Ligue 1', type: 'league', confederation: 'UEFA', isPopular: true, description: "France's top division, a breeding ground for world-class talent, featuring the star-studded Paris Saint-Germain." },
  { id: 'eredivisie', name: '🇳🇱 Eredivisie 🦁', promptFocus: 'the Dutch Eredivisie', type: 'league', confederation: 'UEFA', isPopular: false, description: "The Netherlands' top league, known for its focus on youth development and attacking football, led by Ajax, PSV, and Feyenoord." },
  { id: 'primeira_liga', name: '🇵🇹 Primeira Liga 🦅', promptFocus: 'Portugal\'s Primeira Liga', type: 'league', confederation: 'UEFA', isPopular: false, description: "Portugal's premier league, characterized by its fierce 'Big Three' rivalry between Benfica, Porto, and Sporting CP." },
  { id: 'mls', name: '🇺🇸 Major League Soccer ⚽', promptFocus: 'the American MLS', type: 'league', confederation: 'CONCACAF', isPopular: true, description: "The top professional soccer league in the US and Canada, rapidly growing with global icons and a unique playoff format." },
  { id: 'brasileirao', name: '🇧🇷 Brasileirão 🇧🇷', promptFocus: 'Brazil\'s Serie A (Brasileirão)', type: 'league', confederation: 'CONMEBOL', isPopular: true, description: "Brazil's top division, famous for its flair, unpredictable nature, and producing endless streams of creative talent." },
  { id: 'arg_primera', name: '🇦🇷 Argentine Primera 🇦🇷', promptFocus: 'Argentine Primera División', type: 'league', confederation: 'CONMEBOL', isPopular: false, description: "Argentina's elite league, known for its intense passion and the legendary Superclásico between Boca Juniors and River Plate." },
  { id: 'saudi_pro', name: '🇸🇦 Saudi Pro League 🇸🇦', promptFocus: 'Saudi Pro League', type: 'league', confederation: 'AFC', isPopular: true, description: "A rapidly expanding league attracting global superstars, aiming to become one of the world's top football destinations." },
  { id: 'j_league', name: '🇯🇵 J1 League 🇯🇵', promptFocus: 'Japan\'s J1 League', type: 'league', confederation: 'AFC', isPopular: true, description: "Japan's top flight, recognized for its high technical standards, disciplined play, and growing international reputation as Asia's premier league." },
  { id: 'scottish_prem', name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Premiership 🦄', promptFocus: 'the Scottish Premiership', type: 'league', confederation: 'UEFA', isPopular: true, description: "Scotland's top flight, dominated by the historic 'Old Firm' rivalry between Celtic and Rangers, known for its intense atmosphere and passionate support." },
  { id: 'serie_b', name: '🇮🇹 Serie B 🇮🇹', promptFocus: 'Italy\'s Serie B', type: 'league', confederation: 'UEFA', isPopular: false, description: "Italy's second tier, a highly competitive league where historic clubs fight for a return to the top flight." },
  { id: 'bel_pro_league', name: '🇧🇪 Pro League 🇧🇪', promptFocus: 'the Belgian Pro League', type: 'league', confederation: 'UEFA', isPopular: true, description: "Belgium's top division, known for its competitive nature, unique playoff system, and reputation for developing world-class talent for Europe's biggest clubs." },
  { id: 'tur_super_lig', name: '🇹🇷 Süper Lig 🇹🇷', promptFocus: 'the Turkish Süper Lig', type: 'league', confederation: 'UEFA', isPopular: true, description: "Turkey's premier league, famous for its incredibly passionate fans, intense Istanbul derbies, and historic clubs like Galatasaray, Fenerbahçe, and Beşiktaş." },
  { id: 'col_primera', name: '🇨🇴 Primera A 🇨🇴', promptFocus: 'Colombia\'s Categoría Primera A', type: 'league', confederation: 'CONMEBOL', isPopular: true, description: "Colombia's top flight, known for its physical play, technical flair, and producing gifted players for global markets, led by giants like Atlético Nacional and Millonarios." },
  { id: 'ecu_serie_a', name: '🇪🇨 Serie A 🇪🇨', promptFocus: 'the Ecuadorian Serie A', type: 'league', confederation: 'CONMEBOL', isPopular: true, description: "Ecuador's premier competition, featuring high-altitude matches and rising continental powers like Independiente del Valle and LDU Quito." },
  { id: 'rsl', name: '🇸🇦 Riyadh Soccer League ⚽', promptFocus: 'the Riyadh Soccer League (RSL)', type: 'league', confederation: 'AFC', isPopular: false, description: "The Riyadh Soccer League, a growing competition in Saudi Arabia." },
  { 
    id: 'others', 
    name: '🌍 Global Leagues 🌎', 
    promptFocus: 'other notable football leagues globally, focusing on major talking points or standout teams/players.',
    type: 'league',
    isPopular: false
  },
];

export const NATIONS: Nation[] = [
    // CONMEBOL
    { id: 'arg', name: '🇦🇷 Argentina ⭐⭐⭐', countryCode: 'AR', promptFocus: 'the Argentinian national football team', confederation: 'CONMEBOL', type: 'nation', isPopular: true, description: "Reigning world champions, famous for their technical mastery, tactical discipline, and producing legends like Maradona and Messi." },
    { id: 'bra', name: '🇧🇷 Brazil 🇧🇷', countryCode: 'BR', promptFocus: 'the Brazilian national football team', confederation: 'CONMEBOL', type: 'nation', isPopular: true, description: "The most successful nation in World Cup history, synonymous with 'Joga Bonito', flair, and an endless production of superstar talent." },
    { id: 'uru', name: '🇺🇾 Uruguay 🇺🇾', countryCode: 'UY', promptFocus: 'the Uruguayan national football team', confederation: 'CONMEBOL', type: 'nation', isPopular: false, description: "A small nation with a massive football heart, twice world champions, known for their 'Garra Charrúa' spirit and elite strikers." },
    { id: 'col', name: '🇨🇴 Colombia 🇨🇴', countryCode: 'CO', promptFocus: 'the Colombian national football team', confederation: 'CONMEBOL', type: 'nation', isPopular: false, description: "A vibrant footballing nation known for its creative midfielders, physical strength, and passionate support." },
    
    // UEFA
    { id: 'eng', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England 🦁', countryCode: 'GB-ENG', promptFocus: 'the English national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "The birthplace of football, featuring a star-studded squad and a rich history, always among the favorites in major tournaments." },
    { id: 'fra', name: '🇫🇷 France 🇫🇷', countryCode: 'FR', promptFocus: 'the French national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "A modern footballing powerhouse, twice world champions, renowned for their incredible depth of talent and athletic excellence." },
    { id: 'ger', name: '🇩🇪 Germany 🇩🇪', countryCode: 'DE', promptFocus: 'the German national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "A four-time world champion, celebrated for their efficiency, tactical organization, and consistent success on the global stage." },
    { id: 'ita', name: '🇮🇹 Italy 🇮🇹', countryCode: 'IT', promptFocus: 'the Italian national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "A defensive masterclass nation with four world titles, known for their tactical intelligence and historic 'Catenaccio' legacy." },
    { id: 'esp', name: '🇪🇸 Spain 🇪🇸', countryCode: 'ES', promptFocus: 'the Spanish national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "Pioneers of the 'Tiki-Taka' style, known for their exceptional ball retention, technical precision, and recent era of dominance." },
    { id: 'por', name: '🇵🇹 Portugal 🇵🇹', countryCode: 'PT', promptFocus: 'the Portuguese national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "A nation that consistently punches above its weight, known for producing world-class wingers and the legendary Cristiano Ronaldo." },
    { id: 'ned', name: '🇳🇱 Netherlands 🇳🇱', countryCode: 'NL', promptFocus: 'the Dutch national football team', confederation: 'UEFA', type: 'nation', isPopular: true, description: "The creators of 'Total Football', famous for their tactical innovation, orange kits, and producing some of the game's greatest thinkers." },
    { id: 'cro', name: '🇭🇷 Croatia 🇭🇷', countryCode: 'HR', promptFocus: 'the Croatian national football team', confederation: 'UEFA', type: 'nation', isPopular: false, description: "A small but mighty nation, known for their exceptional midfield talent and remarkable ability to compete with the world's best." },

    // CAF
    { id: 'mar', name: '🇲🇦 Morocco 🦁', countryCode: 'MA', promptFocus: 'the Moroccan national football team', confederation: 'CAF', type: 'nation', isPopular: true, description: "The pride of African football, recently making history as the first African nation to reach a World Cup semi-final." },
    { id: 'sen', name: '🇸🇳 Senegal 🇸🇳', countryCode: 'SN', promptFocus: 'the Senegalese national football team', confederation: 'CAF', type: 'nation', isPopular: false, description: "A dominant force in African football, known for their physical power, speed, and the leadership of stars like Sadio Mané." },
    { id: 'nga', name: '🇳🇬 Nigeria 🦅', countryCode: 'NG', promptFocus: 'the Nigerian national football team', confederation: 'CAF', type: 'nation', isPopular: false, description: "The 'Super Eagles' of Africa, famous for their exciting attacking play, iconic kits, and producing legendary creative talents." },

    // CONCACAF
    { id: 'usa', name: '🇺🇸 USA 🇺🇸', countryCode: 'US', promptFocus: 'the United States men\'s national soccer team (USMNT)', confederation: 'CONCACAF', type: 'nation', isPopular: true, description: "A rapidly growing football nation, featuring a young, athletic squad playing in top European leagues and hosting the 2026 World Cup." },
    { id: 'mex', name: '🇲🇽 Mexico 🇲🇽', countryCode: 'MX', promptFocus: 'the Mexican national football team', confederation: 'CONCACAF', type: 'nation', isPopular: true, description: "A CONCACAF powerhouse with a massive following, known for their technical skill and consistent presence in the World Cup knockout stages." },
    
    // AFC
    { id: 'jpn', name: '🇯🇵 Japan 🇯🇵', countryCode: 'JP', promptFocus: 'the Japanese national football team', confederation: 'AFC', type: 'nation', isPopular: false, description: "The leading force in Asian football, recognized for their technical discipline, high-speed play, and growing global competitiveness." },
    { id: 'kor', name: '🇰🇷 South Korea 🇰🇷', countryCode: 'KR', promptFocus: 'the South Korean national football team', confederation: 'AFC', type: 'nation', isPopular: false, description: "A consistent Asian power, known for their incredible work rate, speed, and the brilliance of stars like Son Heung-min." },
];

export const REALTIME_CATEGORIES: RealtimeCategory[] = [
  { id: 'live', name: '🔴 Live Scoreboard', promptFocus: 'live or very recently finished major football matches happening right now globally', type: 'realtime' },
  { id: 'upcoming', name: '🗓️ Upcoming Fixes', promptFocus: 'major upcoming football matches in the next 24 hours across top leagues', type: 'realtime' },
  { id: 'previous', name: '✅ Recent Results', promptFocus: 'completed key football matches from the last 12-24 hours', type: 'realtime' },
];

export const EPL_TEAMS = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
  "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
  "Leicester City", "Liverpool", "Manchester City", "Manchester United",
  "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
  "West Ham United", "Wolverhampton Wanderers"
];

export const SEASONS = [
  "2025/2026", "2024/2025", "2023/2024", "2022/2023", "2021/2022", "2020/2021"
];

export const TABS: TabDefinition[] = [
  { id: 'review', label: '📝 Review' },
  { id: 'fixtures', label: '📅 Fixtures' },
  { id: 'calendar', label: '🗓️ Calendar' },
  { id: 'highlights', label: '🎬 Highlights' },
  { id: 'insights', label: '🧠 Insights' },
  { id: 'tactics', label: '📋 Tactics' },
  { id: 'predictions', label: '🔮 Predictions' },
  { id: 'performance', label: '📊 Performance' },
  { id: 'stats', label: '📈 Stats' },
  { id: 'team-stats', label: '📊 Team Stats' },
  { id: 'standings', label: '🏆 Standings' },
  { id: 'strengths', label: '🛡️ Strengths' },
  { id: 'betting', label: '🎲 Betting' },
  { id: 'ai-lab', label: '🧪 AI Lab' },
  { id: 'ai-vision', label: '👁️ AI Vision' },
];
