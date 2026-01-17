
export interface League {
  id: string;
  name: string;
  promptFocus: string;
  type: 'league';
  confederation?: Confederation;
  isPopular?: boolean;
}

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export interface Nation {
  id:string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 code
  promptFocus: string;
  confederation: Confederation;
  type: 'nation';
}

export interface RealtimeCategory {
    id: 'previous' | 'live' | 'upcoming';
    name: string;
    promptFocus: string;
    type: 'realtime';
}

export type SelectableEntity = League | Nation | RealtimeCategory;

export type ContentData = string | null;

export type TabId = 'review' | 'fixtures' | 'calendar' | 'highlights' | 'insights' | 'performance' | 'betting' | 'tactics' | 'predictions';

export interface TabDefinition {
  id: TabId;
  label: string;
}

export interface PlayerProfile {
    name: string;
    club: string;
    position: string;
    strengths: string[];
    recentPerformance: string;
}

export interface PlayerComparisonData {
    players: (PlayerProfile & { comparisonVerdict: string })[];
    overallAnalysis: string;
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

export type ViewMode = 'leagues' | 'nations' | 'realtime';

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

// Fixed missing export for BeforeInstallPromptEvent to resolve build error in InstallButton.tsx
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
