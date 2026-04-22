
export interface League {
  id: string;
  name: string;
  promptFocus: string;
  type: 'league';
  confederation?: Confederation;
  isPopular?: boolean;
  description?: string;
}

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export interface Nation {
  id:string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 code
  promptFocus: string;
  confederation: Confederation;
  type: 'nation';
  isPopular?: boolean;
  description?: string;
}

export interface RealtimeCategory {
    id: 'previous' | 'live' | 'upcoming';
    name: string;
    promptFocus: string;
    type: 'realtime';
}

export type SelectableEntity = League | Nation | RealtimeCategory;

export type ContentData = string | null;

export interface PlayerStat {
  name: string;
  team: string;
  goals: number;
  assists: number;
  appearances: number;
}

export interface PlayerStatsData {
  topScorers: PlayerStat[];
  topAssisters: PlayerStat[];
  mostAppearances: PlayerStat[];
}

export interface PlayerAnalysis {
  name: string;
  position: string;
  strengths: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface PlayerAnalysisData {
  keyPlayers: PlayerAnalysis[];
  tacticalImpact: string;
}

export interface MatchResult {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

export interface UpcomingFixture {
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
  status?: 'Scheduled' | 'Live' | 'Postponed';
}

export interface LeagueFixturesData {
  recentResults: MatchResult[];
  upcomingFixtures: UpcomingFixture[];
}

export interface StandingEntry {
  rank: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form?: string;
}

export interface LeagueStandings {
  leagueName: string;
  season: string;
  standings: StandingEntry[];
}

export interface TeamStats {
  teamName: string;
  shotsOnTarget: number;
  possession: number; // percentage
  passAccuracy: number; // percentage
  defensiveClearances: number;
  goalsScored: number;
  cleanSheets: number;
}

export interface LeagueTeamStats {
  leagueName: string;
  season: string;
  teams: TeamStats[];
}

export type TabId = 'review' | 'fixtures' | 'calendar' | 'highlights' | 'insights' | 'performance' | 'betting' | 'tactics' | 'predictions' | 'ai-lab' | 'stats' | 'strengths' | 'standings' | 'team-stats' | 'ai-vision';

export interface TabDefinition {
  id: TabId;
  label: string;
}

export interface CareerEntry {
  club: string;
  years: string;
  appearances: number;
  goals: number;
  assists?: number;
  achievements?: string[];
}

export interface PlayerProfile {
    name: string;
    club: string;
    position: string;
    strengths: string[];
    weaknesses: string[];
    biography: string;
    recentPerformance: string;
    careerHistory?: CareerEntry[];
}

export type ComparisonContext = 'current-season' | 'all-time';

export interface HeadToHeadMetric {
  label: string;
  value: string;
}

export interface HeadToHeadData {
  record: string;
  metrics: HeadToHeadMetric[];
}

export interface PlayerComparisonData {
    players: (PlayerProfile & { comparisonVerdict: string })[];
    overallAnalysis: string;
    headToHead?: HeadToHeadData;
}

export interface PlayerPosition {
    position: string;
    x: number;
    y: number;
}

export interface TacticalData {
    formationName: string;
    description: string;
    players: PlayerPosition[];
}

export interface Fixture {
    date: string;
    competition: string;
    homeTeam: string;
    awayTeam: string;
    time?: string;
}

export interface Prediction {
  homeTeam: string;
  awayTeam: string;
  predictedOutcome: 'Home Win' | 'Draw' | 'Away Win';
  confidenceScore: number;
  reasoning: string;
  suggestedScore?: string;
}

export type ViewMode = 'leagues' | 'nations' | 'realtime' | 'discussion' | 'contact';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface DiscussionMessage {
  id: string;
  text: string;
  user: ChatUser;
  timestamp: number;
}

export interface VideoHighlight {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  date: string;
}

export interface LeagueHighlights {
  leagueName: string;
  highlights: VideoHighlight[];
}

export type FixtureInfo = string;
export type HighlightInfo = string;
export type InsightInfo = string;
export type PerformanceDataInfo = string;

export interface BettingOdd {
  homeTeam: string;
  awayTeam: string;
  odds: {
    '1': number | string;
    'X': number | string;
    '2': number | string;
  };
  matchDate?: string;
}

export interface BettingInfo {
  strategicAdvice: string;
  odds: BettingOdd[];
  predictions?: Prediction[];
}

export interface ScoreProbability {
  score: string;
  probability: number; // 0 to 100
}

export interface CorrectScoreMatrix {
  homeTeam: string;
  awayTeam: string;
  matrix: ScoreProbability[];
}

export interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  context: string;
  score?: string;
  date?: string;
  isFuture: boolean;
  entityName: string;
}

export type AnalysisType = 'pre-match' | 'halftime' | 'post-match';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RealtimeMatch {
  homeTeam: string;
  awayTeam: string;
  score?: string;
  status: 'FT' | 'HT' | 'Live' | 'Scheduled' | 'Postponed' | 'Cancelled';
  time?: string;
  competition: string;
}

export interface GroundedMatchData {
  matches: RealtimeMatch[];
  sources: GroundingSource[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MediaAnalysisResult {
  text: string;
  mediaType: 'image' | 'video';
}

export interface VideoGenerationResult {
  url: string;
  prompt: string;
}

export type ImageSize = '1K' | '2K' | '4K';
export type ImageAspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type VideoAspectRatio = '16:9' | '9:16';

