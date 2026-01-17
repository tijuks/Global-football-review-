
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { PlayerProfile, TacticalData, Fixture, BettingInfo, MatchInfo, RealtimeMatch, PlayerComparisonData, Prediction } from '../types';
import i18n from 'i18next';

// Fix initialization to use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getCurrentLanguage = () => {
  const lng = i18n.language || 'en';
  const names: Record<string, string> = { 'en': 'English', 'es': 'Spanish', 'fr': 'French' };
  return names[lng.split('-')[0]] || 'English';
};

const generateContentInternal = async (prompt: string, config?: any): Promise<string> => {
  // Inject language instruction into every prompt
  const localizedPrompt = `${prompt}\n\nIMPORTANT: Please provide the entire response in ${getCurrentLanguage()}.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: { parts: [{ text: localizedPrompt }] },
        config,
    });
    
    // Access response.text directly (not as a method)
    const text = response.text;
    if (!text || text.trim() === "") {
        return "No information could be generated at this time.";
    }
    return text;
  } catch (error) {
    console.error("Error fetching content from Gemini API:", error);
    throw new Error(`An unexpected error occurred with the Gemini API.`);
  }
};

const PLAYER_NAME_PROMPT_SUFFIX = "Important: When you mention a specific football player, please wrap their full name in double square brackets, like this: [[Lionel Messi]].";

export const generateLeagueReviewPrompt = (leagueFocus: string): string => {
  return `Provide a comprehensive football review for ${leagueFocus}. Include narrative, top teams, key players, talking points, and outlook. Format in plain text. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchReview = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generateFixturesPrompt = (leagueFocus: string): string => {
  return `List recent results and upcoming fixtures for ${leagueFocus}. Format as plain text.`;
};
export const fetchFixtures = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generateCalendarPrompt = (entityFocus: string): string => {
  return `Provide upcoming fixtures for ${entityFocus} as a JSON array. Date YYYY-MM-DD, competition, homeTeam, awayTeam.`;
};

export const fetchCalendar = async (prompt: string): Promise<Fixture[]> => {
    const jsonString = await generateContentInternal(prompt, { responseMimeType: "application/json" });
    try {
        return JSON.parse(jsonString.trim()) as Fixture[];
    } catch (e) {
        throw new Error("Could not parse the calendar data.");
    }
};

export const generateHighlightsPrompt = (leagueFocus: string): string => {
  return `Provide concise summaries of 2-3 recent key match highlights for ${leagueFocus}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchHighlights = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generateInsightsPrompt = (leagueFocus: string): string => {
  return `Offer deeper football insights for ${leagueFocus}. Tactical trends, surprising performances, standout players. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchInsights = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generatePerformanceDataPrompt = (leagueFocus: string): string => {
  return `Describe key performance statistics or trends for ${leagueFocus}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchPerformanceData = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generateBettingInfoPrompt = (leagueFocus: string): string => {
  return `For ${leagueFocus}, provide betting analysis JSON: strategicAdvice and odds array. Mandatory disclaimer.`;
};

export const fetchBettingInfo = async (prompt: string): Promise<BettingInfo> => {
    const jsonString = await generateContentInternal(prompt, { responseMimeType: "application/json" });
    try {
        return JSON.parse(jsonString.trim()) as BettingInfo;
    } catch (e) {
        return { strategicAdvice: jsonString, odds: [] };
    }
};

export const fetchPlayerProfile = async (playerName: string, leagueContext: string): Promise<PlayerProfile> => {
    const prompt = `Provide player profile for ${playerName} in ${leagueContext}. JSON: name, club, position, strengths[], recentPerformance.`;
    const jsonString = await generateContentInternal(prompt, { responseMimeType: "application/json" });
    try {
        return JSON.parse(jsonString.trim()) as PlayerProfile;
    } catch (e) {
        throw new Error("Could not parse player profile.");
    }
};

export const fetchPlayerSuggestions = async (query: string): Promise<string[]> => {
    const prompt = `Generate a JSON array of up to 5 popular current football player names that start with or closely match "${query}". Provide only the array of strings.`;
    const schema = {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    };
    try {
        const jsonString = await generateContentInternal(prompt, { 
            responseMimeType: "application/json",
            responseSchema: schema
        });
        return JSON.parse(jsonString.trim()) as string[];
    } catch (e) {
        return [];
    }
};

export const fetchPlayerComparison = async (playerNames: string[], context: string): Promise<PlayerComparisonData> => {
    const prompt = `
        Compare the following players: ${playerNames.join(', ')} in the context of ${context}.
        Return a JSON object with:
        1. "players": An array of objects, each containing: name, club, position, strengths[], recentPerformance, and a "comparisonVerdict" (e.g., "The more clinical finisher").
        2. "overallAnalysis": A paragraph summarizing how these players compare tactically and who might be the better fit for a specific role.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            players: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        club: { type: Type.STRING },
                        position: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recentPerformance: { type: Type.STRING },
                        comparisonVerdict: { type: Type.STRING },
                    },
                    required: ["name", "club", "position", "strengths", "recentPerformance", "comparisonVerdict"]
                }
            },
            overallAnalysis: { type: Type.STRING }
        },
        required: ["players", "overallAnalysis"]
    };

    const jsonString = await generateContentInternal(prompt, { 
        responseMimeType: "application/json",
        responseSchema: schema
    });
    
    try {
        return JSON.parse(jsonString.trim()) as PlayerComparisonData;
    } catch (e) {
        throw new Error("Could not parse player comparison data.");
    }
};

export const fetchTacticalFormation = async (leagueFocus: string): Promise<TacticalData> => {
    const prompt = `Analyze common tactics in ${leagueFocus}. Prevailing formation JSON: formationName, description, players[{position, x, y}].`;
    const jsonString = await generateContentInternal(prompt, { responseMimeType: "application/json" });
    try {
        return JSON.parse(jsonString.trim()) as TacticalData;
    } catch (e) {
        throw new Error("Could not parse tactical data.");
    }
};

export const generatePredictionsPrompt = (entityFocus: string): string => {
  return `Generate outcome predictions for 3-5 major upcoming matches in ${entityFocus}.
    Return a JSON array of objects. Each object MUST include:
    "homeTeam", "awayTeam", "predictedOutcome" (must be "Home Win", "Draw", or "Away Win"),
    "confidenceScore" (an integer from 0 to 100), "reasoning" (a brief 1-2 sentence explanation),
    and "suggestedScore" (e.g., "2-1").`;
};

export const fetchPredictions = async (prompt: string): Promise<Prediction[]> => {
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        homeTeam: { type: Type.STRING },
        awayTeam: { type: Type.STRING },
        predictedOutcome: { type: Type.STRING },
        confidenceScore: { type: Type.INTEGER },
        reasoning: { type: Type.STRING },
        suggestedScore: { type: Type.STRING },
      },
      required: ["homeTeam", "awayTeam", "predictedOutcome", "confidenceScore", "reasoning"],
    },
  };

  const jsonString = await generateContentInternal(prompt, { 
    responseMimeType: "application/json",
    responseSchema: schema
  });
  
  try {
    return JSON.parse(jsonString.trim()) as Prediction[];
  } catch (e) {
    throw new Error("Could not parse prediction data.");
  }
};

export const generateRealtimeMatchesPrompt = (focus: string): string => {
  return `Provide list of ${focus}. Major leagues/international. 5-10 matches.`;
};

export const fetchRealtimeMatches = async (prompt: string): Promise<RealtimeMatch[]> => {
  const jsonString = await generateContentInternal(prompt, { responseMimeType: "application/json" });
  try {
    return JSON.parse(jsonString.trim()) as RealtimeMatch[];
  } catch (e) {
    throw new Error("Could not parse match data.");
  }
};

export const generatePreMatchAnalysisPrompt = (match: MatchInfo): string => {
  return `Detailed pre-match analysis for ${match.homeTeam} vs ${match.awayTeam}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const generateHalftimeAnalysisPrompt = (match: MatchInfo): string => {
  return `Halftime analysis for ${match.homeTeam} vs ${match.awayTeam}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const generatePostMatchAnalysisPrompt = (match: MatchInfo): string => {
  return `Post-match analysis for ${match.homeTeam} vs ${match.awayTeam}. Score: ${match.score}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchAnalysis = (prompt: string): Promise<string> => generateContentInternal(prompt);
