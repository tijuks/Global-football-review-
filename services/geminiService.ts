
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { 
  PlayerProfile, TacticalData, Fixture, BettingInfo, MatchInfo, 
  RealtimeMatch, PlayerComparisonData, Prediction, GeneratedImage,
  ChatMessage, MediaAnalysisResult,
  ImageSize, ImageAspectRatio, VideoAspectRatio,
  PlayerStatsData, PlayerAnalysisData, LeagueFixturesData,
  LeagueStandings, CorrectScoreMatrix, LeagueHighlights, LeagueTeamStats,
  ComparisonContext
} from '../types';
import i18n from 'i18next';

// Global declaration for AI Studio environment
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Helper to get the current API key
const getApiKey = () => {
  const storedKey = localStorage.getItem('GEMINI_API_KEY');
  return storedKey || process.env.GEMINI_API_KEY || '';
};

// Helper to get AI instance
const getAiInstance = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

const getCurrentLanguage = () => {
  const lng = i18n.language || 'en';
  const names: Record<string, string> = { 'en': 'English', 'es': 'Spanish', 'fr': 'French' };
  return names[lng.split('-')[0]] || 'English';
};

/**
 * Helper to call Gemini API with retry logic and exponential backoff
 */
const callGeminiWithRetry = async (params: any, maxRetries = 3): Promise<GenerateContentResponse> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const ai = getAiInstance();
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini API attempt ${i + 1} failed:`, error);
      
      // Check for specific errors that might benefit from a key reset
      if (error?.message?.includes("Requested entity was not found")) {
        // This is a special case from the guidelines
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           // We can't easily reset state here without UI, but we can log it
           console.error("API Key error detected. User may need to re-select key.");
        }
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

const generateContentInternal = async (prompt: string, config?: any): Promise<string> => {
  // Inject language instruction into every prompt
  const localizedPrompt = `${prompt}\n\nIMPORTANT: Please provide the entire response in ${getCurrentLanguage()}.`;

  try {
    const response = await callGeminiWithRetry({
        model: GEMINI_MODEL_NAME,
        contents: { parts: [{ text: localizedPrompt }] },
        config,
    });
    
    // Use the .text property to access content directly (not a method)
    const text = response.text;
    if (!text || text.trim() === "") {
        return "No information could be generated at this time.";
    }
    return text;
  } catch (error) {
    console.error("Error fetching content from Gemini API after retries:", error);
    throw new Error(`An unexpected error occurred with the Gemini API. Please try again later.`);
  }
};

const PLAYER_NAME_PROMPT_SUFFIX = "Important: When you mention a specific football player, please wrap their full name in double square brackets, like this: [[Lionel Messi]].";

export const generateLeagueReviewPrompt = (leagueFocus: string): string => {
  return `Provide a comprehensive football review for ${leagueFocus}. Include narrative, top teams, key players, talking points, and outlook. Format in plain text. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchReview = (prompt: string): Promise<string> => generateContentInternal(prompt);

/**
 * Fetch a custom EPL review with season and team options
 */
export const fetchEPLReview = async (season?: string, teams?: string[]): Promise<string> => {
  let prompt = `Provide a comprehensive football review for the English Premier League (EPL).`;
  if (season) {
    prompt += ` Focus on the ${season} season.`;
  }
  if (teams && teams.length > 0) {
    prompt += ` Specifically highlight the following teams: ${teams.join(', ')}.`;
  }
  prompt += ` Include narrative, top teams, key players, talking points, and outlook. Format in plain text. ${PLAYER_NAME_PROMPT_SUFFIX}`;
  
  return generateContentInternal(prompt);
};

export const generateFixturesPrompt = (leagueFocus: string): string => {
  return `Provide recent match results and upcoming fixtures for ${leagueFocus}. 
  Include at least 5 recent results and 5 upcoming fixtures.
  Return the data in a structured JSON format.`;
};

export const fetchFixtures = async (prompt: string): Promise<LeagueFixturesData> => {
  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recentResults: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                homeTeam: { type: Type.STRING },
                awayTeam: { type: Type.STRING },
                homeScore: { type: Type.NUMBER },
                awayScore: { type: Type.NUMBER },
                competition: { type: Type.STRING }
              },
              required: ["date", "homeTeam", "awayTeam", "homeScore", "awayScore", "competition"]
            }
          },
          upcomingFixtures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                homeTeam: { type: Type.STRING },
                awayTeam: { type: Type.STRING },
                competition: { type: Type.STRING },
                venue: { type: Type.STRING },
                status: { type: Type.STRING, description: "One of 'Scheduled', 'Live', 'Postponed'" }
              },
              required: ["date", "time", "homeTeam", "awayTeam", "competition"]
            }
          }
        },
        required: ["recentResults", "upcomingFixtures"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

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

export const generateInsightsPrompt = (leagueFocus: string): string => {
  return `Offer deeper football insights for ${leagueFocus}. Tactical trends, surprising performances, standout players. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchInsights = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generatePerformanceDataPrompt = (leagueFocus: string): string => {
  return `Describe key performance statistics or trends for ${leagueFocus}. ${PLAYER_NAME_PROMPT_SUFFIX}`;
};
export const fetchPerformanceData = (prompt: string): Promise<string> => generateContentInternal(prompt);

export const generateBettingInfoPrompt = (leagueFocus: string): string => {
  return `For ${leagueFocus}, provide a comprehensive betting analysis. 
  Include:
  1. "strategicAdvice": A detailed narrative on betting trends and strategies.
  2. "odds": An array of illustrative match odds (homeTeam, awayTeam, matchDate, odds: {1, X, 2}).
  3. "predictions": An array of specific match outcome predictions. Each prediction MUST include:
     "homeTeam", "awayTeam", "predictedOutcome" (must be "Home Win", "Draw", or "Away Win"),
     "confidenceScore" (an integer from 0 to 100), "reasoning" (a brief 1-2 sentence explanation),
     and "suggestedScore" (e.g., "2-1").
  Return the data in a structured JSON format.`;
};

export const fetchBettingInfo = async (prompt: string): Promise<BettingInfo> => {
    const response = await callGeminiWithRetry({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategicAdvice: { type: Type.STRING },
            odds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  matchDate: { type: Type.STRING },
                  odds: {
                    type: Type.OBJECT,
                    properties: {
                      '1': { type: Type.STRING },
                      'X': { type: Type.STRING },
                      '2': { type: Type.STRING }
                    },
                    required: ['1', 'X', '2']
                  }
                },
                required: ["homeTeam", "awayTeam", "odds"]
              }
            },
            predictions: {
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
            }
          },
          required: ["strategicAdvice", "odds"]
        }
      }
    });

    try {
        const text = response.text || "";
        return JSON.parse(text.trim()) as BettingInfo;
    } catch (e) {
        return { strategicAdvice: response.text || "", odds: [] };
    }
};

export const fetchPlayerProfile = async (playerName: string, leagueContext: string): Promise<PlayerProfile> => {
    const prompt = `Provide player profile for ${playerName} in ${leagueContext}. 
    Include: name, club, position, strengths[], weaknesses[], biography (early life, career beginnings, and significant personal details), recentPerformance, and a detailed careerHistory array.
    Each careerHistory entry should have: club, years (e.g. "2018-2022"), appearances (number), goals (number), assists (number), and achievements (array of strings).
    Return as JSON.`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            club: { type: Type.STRING },
            position: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            biography: { type: Type.STRING },
            recentPerformance: { type: Type.STRING },
            careerHistory: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        club: { type: Type.STRING },
                        years: { type: Type.STRING },
                        appearances: { type: Type.NUMBER },
                        goals: { type: Type.NUMBER },
                        assists: { type: Type.NUMBER },
                        achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["club", "years", "appearances", "goals"]
                }
            }
        },
        required: ["name", "club", "position", "strengths", "weaknesses", "biography", "recentPerformance", "careerHistory"]
    };

    const jsonString = await generateContentInternal(prompt, { 
        responseMimeType: "application/json",
        responseSchema: schema
    });
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

export const fetchPlayerComparison = async (playerNames: string[], context: ComparisonContext): Promise<PlayerComparisonData> => {
    const prompt = `
        Compare the following players: ${playerNames.join(', ')} in the context of ${context}.
        Return a JSON object with:
        1. "players": An array of objects, each containing: name, club, position, strengths[], recentPerformance, and a "comparisonVerdict" (e.g., "The more clinical finisher").
        2. "overallAnalysis": A paragraph summarizing how these players compare tactically and who might be the better fit for a specific role.
        3. "headToHead": An object containing:
           - "record": A string summarizing their head-to-head record (e.g., "5 wins, 2 draws, 1 loss").
           - "metrics": An array of objects, each with "label" and "value" for key performance metrics in head-to-head matches.
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
            overallAnalysis: { type: Type.STRING },
            headToHead: {
                type: Type.OBJECT,
                properties: {
                    record: { type: Type.STRING },
                    metrics: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                value: { type: Type.STRING }
                            },
                            required: ["label", "value"]
                        }
                    }
                },
                required: ["record", "metrics"]
            }
        },
        required: ["players", "overallAnalysis", "headToHead"]
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

/**
 * Generate an AI portrait of a football player using Nano Banana Pro
 */
export const generatePlayerImage = async (playerName: string): Promise<GeneratedImage> => {
  const prompt = `A cinematic, high-action football poster portrait of ${playerName} in their team's kit, mid-action during a match, intense lighting, stadium atmosphere, 4k resolution, hyper-realistic.`;
  
  try {
    const url = await generateImageNano(prompt, '1K', '1:1');
    return { url, prompt };
  } catch (error) {
    console.error("AI Image Generation Error:", error);
    throw error;
  }
};
/**
 * Fetch team logo from TheSportsDB
 */
export const fetchTeamLogo = async (teamName: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/team-logo?teamName=${encodeURIComponent(teamName)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.logo || null;
  } catch (error) {
    console.error("Error fetching team logo:", error);
    return null;
  }
};

/**
 * Fetch player image from TheSportsDB
 */
export const fetchPlayerImage = async (playerName: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`);
    const data = await response.json();
    if (data.player && data.player.length > 0) {
      return data.player[0].strThumb || data.player[0].strCutout || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching player image:", error);
    return null;
  }
};

export const chatWithGemini = async (messages: ChatMessage[]): Promise<string> => {
  const lastMessage = messages[messages.length - 1].text;
  
  // Wrap chat in a retry loop manually since it's a different flow
  let lastError: any;
  for (let i = 0; i < 3; i++) {
    try {
      const ai = getAiInstance();
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "You are a world-class football expert and analyst. Provide insightful, accurate, and engaging responses about football.",
        },
      });
      const response = await chat.sendMessage({ message: lastMessage });
      return response.text || "No response.";
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

/**
 * Analyze Image or Video using Gemini Pro
 */
export const analyzeMedia = async (file: File, prompt: string): Promise<MediaAnalysisResult> => {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  const isVideo = file.type.startsWith('video/');
  
  const response = await callGeminiWithRetry({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: prompt }
      ]
    }
  });

  return {
    text: response.text || "Analysis failed.",
    mediaType: isVideo ? 'video' : 'image'
  };
};

/**
 * Transcribe Audio using Gemini Flash
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(audioBlob);
  });

  const response = await callGeminiWithRetry({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: audioBlob.type } },
        { text: "Transcribe this audio accurately. Only return the transcription." }
      ]
    }
  });

  return response.text || "";
};

/**
 * Generate Video using Veo 3
 */
export const generateVideoVeo = async (prompt: string, aspectRatio: VideoAspectRatio): Promise<string> => {
  let operation: any;
  
  // Retry the initial generation call
  let lastError: any;
  for (let i = 0; i < 3; i++) {
    try {
      const ai = getAiInstance();
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio
        }
      });
      break;
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  if (!operation) throw lastError;

  // Poll for completion with retries on the operation check
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (let i = 0; i < 3; i++) {
      try {
        const ai = getAiInstance();
        operation = await ai.operations.getVideosOperation({ operation: operation });
        break;
      } catch (error) {
        if (i === 2) throw error;
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': getApiKey(),
    },
  });
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Generate Image using Nano Banana Pro
 */
export const generateImageNano = async (prompt: string, size: ImageSize, aspectRatio: ImageAspectRatio): Promise<string> => {
  const response = await callGeminiWithRetry({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image generation failed.");
};

/**
 * Text to Speech using Gemini Flash TTS
 */
export const textToSpeech = async (text: string): Promise<string> => {
  const response = await callGeminiWithRetry({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return `data:audio/wav;base64,${base64Audio}`;
  }
  throw new Error("TTS failed.");
};

/**
 * Search Grounding Query
 */
export const searchGroundingQuery = async (query: string): Promise<string> => {
  const response = await callGeminiWithRetry({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text || "No information found.";
};

/**
 * Fetch key player statistics for a league or nation
 */
export const fetchPlayerStats = async (entityFocus: string): Promise<PlayerStatsData> => {
  const prompt = `Provide key player statistics for the current season of ${entityFocus}. 
  Include top 5 scorers, top 5 assisters, and top 5 players with most appearances.
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topScorers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                team: { type: Type.STRING },
                goals: { type: Type.NUMBER },
                assists: { type: Type.NUMBER },
                appearances: { type: Type.NUMBER }
              },
              required: ["name", "team", "goals", "assists", "appearances"]
            }
          },
          topAssisters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                team: { type: Type.STRING },
                goals: { type: Type.NUMBER },
                assists: { type: Type.NUMBER },
                appearances: { type: Type.NUMBER }
              },
              required: ["name", "team", "goals", "assists", "appearances"]
            }
          },
          mostAppearances: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                team: { type: Type.STRING },
                goals: { type: Type.NUMBER },
                assists: { type: Type.NUMBER },
                appearances: { type: Type.NUMBER }
              },
              required: ["name", "team", "goals", "assists", "appearances"]
            }
          }
        },
        required: ["topScorers", "topAssisters", "mostAppearances"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Fetch detailed player analysis (strengths and metrics)
 */
export const fetchPlayerAnalysis = async (entityFocus: string): Promise<PlayerAnalysisData> => {
  const prompt = `Provide a detailed analysis of the key players in ${entityFocus} for the current season. 
  For each of the top 5 players, include their name, position, a list of 3-4 key strengths, and 3 specific performance metrics (e.g., pass accuracy, successful dribbles, interceptions).
  Also provide a brief summary of their collective tactical impact.
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyPlayers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                position: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                metrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                }
              },
              required: ["name", "position", "strengths", "metrics"]
            }
          },
          tacticalImpact: { type: Type.STRING }
        },
        required: ["keyPlayers", "tacticalImpact"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Fetch detailed team statistics for a league
 */
export const fetchTeamStats = async (entityFocus: string): Promise<LeagueTeamStats> => {
  const prompt = `Provide detailed team statistics for the current season of ${entityFocus}. 
  For each team, include metrics like shots on target per match, average possession percentage, pass accuracy percentage, defensive clearances per match, total goals scored, and clean sheets.
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leagueName: { type: Type.STRING },
          season: { type: Type.STRING },
          teams: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                teamName: { type: Type.STRING },
                shotsOnTarget: { type: Type.NUMBER },
                possession: { type: Type.NUMBER },
                passAccuracy: { type: Type.NUMBER },
                defensiveClearances: { type: Type.NUMBER },
                goalsScored: { type: Type.NUMBER },
                cleanSheets: { type: Type.NUMBER }
              },
              required: ["teamName", "shotsOnTarget", "possession", "passAccuracy", "defensiveClearances", "goalsScored", "cleanSheets"]
            }
          }
        },
        required: ["leagueName", "season", "teams"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generate a prompt for team stats
 */
export const generateTeamStatsPrompt = (entityFocus: string) => `detailed team statistics for ${entityFocus}`;
export const fetchHighlights = async (entityFocus: string): Promise<LeagueHighlights> => {
  const prompt = `Find the latest video highlights for ${entityFocus}. 
  Provide a list of highlights including title, a representative thumbnail URL (use high quality placeholder if needed), the video URL (e.g. YouTube), duration, and date.
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leagueName: { type: Type.STRING },
          highlights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                thumbnailUrl: { type: Type.STRING },
                videoUrl: { type: Type.STRING },
                duration: { type: Type.STRING },
                date: { type: Type.STRING }
              },
              required: ["title", "videoUrl", "thumbnailUrl"]
            }
          }
        },
        required: ["leagueName", "highlights"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as LeagueHighlights;
  } catch (e) {
    console.error("Failed to parse highlights:", e);
    return { leagueName: entityFocus, highlights: [] };
  }
};

/**
 * Generate a prompt for highlights
 */
export const generateHighlightsPrompt = (entityFocus: string) => `latest video highlights for ${entityFocus}`;
export const fetchCorrectScoreMatrix = async (homeTeam: string, awayTeam: string): Promise<CorrectScoreMatrix> => {
  const prompt = `Generate a correct score probability matrix for the match between ${homeTeam} and ${awayTeam}. 
  Include the top 10 most likely scores (e.g., "1-0", "2-1", "0-0", "1-1").
  For each score, provide a probability percentage (0-100). The sum of probabilities should be realistic (not necessarily 100% as these are top picks).
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          homeTeam: { type: Type.STRING },
          awayTeam: { type: Type.STRING },
          matrix: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.STRING },
                probability: { type: Type.NUMBER }
              },
              required: ["score", "probability"]
            }
          }
        },
        required: ["homeTeam", "awayTeam", "matrix"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
export const fetchStandings = async (entityFocus: string): Promise<LeagueStandings> => {
  const prompt = `Provide the current league standings for ${entityFocus} for the 2025/2026 season. 
  Include rank, team name, matches played, wins, draws, losses, goals for, goals against, and total points.
  Return the data in a structured JSON format.`;

  const response = await callGeminiWithRetry({
    model: GEMINI_MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leagueName: { type: Type.STRING },
          season: { type: Type.STRING },
          standings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.NUMBER },
                team: { type: Type.STRING },
                played: { type: Type.NUMBER },
                wins: { type: Type.NUMBER },
                draws: { type: Type.NUMBER },
                losses: { type: Type.NUMBER },
                goalsFor: { type: Type.NUMBER },
                goalsAgainst: { type: Type.NUMBER },
                points: { type: Type.NUMBER },
                form: { type: Type.STRING }
              },
              required: ["rank", "team", "played", "wins", "draws", "losses", "goalsFor", "goalsAgainst", "points"]
            }
          }
        },
        required: ["leagueName", "season", "standings"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generate a prompt for league standings
 */
export const generateStandingsPrompt = (entityFocus: string) => `current league standings for ${entityFocus}`;
export const generatePlayerAnalysisPrompt = (entityFocus: string) => `detailed player strengths and metrics for ${entityFocus}`;
export const generatePlayerStatsPrompt = (entityFocus: string) => `key player statistics for ${entityFocus}`;
export const getFastResponse = async (prompt: string): Promise<string> => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
  return response.text || "";
};

/**
 * Connect to Gemini Live API
 */
export const connectLive = (config: any, callbacks: any) => {
  const ai = getAiInstance();
  return ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-09-2025",
    config,
    callbacks
  });
};
