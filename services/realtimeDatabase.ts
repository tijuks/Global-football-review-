
import { GoogleGenAI, Type } from "@google/genai";
import { GroundedMatchData, GroundingSource, RealtimeMatch } from "../types";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

/**
 * Service Database Helper for fetching Real-time Grounded data.
 */
export const fetchGroundedRealtimeData = async (focus: string): Promise<GroundedMatchData> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Cannot fetch real-time data.");
  }

  const prompt = `Search for actual current football match information for: ${focus}. 
    Provide a list of matches with home team, away team, current score (if live or finished), status (Live, HT, FT, or Scheduled), match time/date, and competition name.
    Focus on major global leagues and international tournaments.
    Return the data as a clean JSON array under a "matches" key.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                homeTeam: { type: Type.STRING },
                awayTeam: { type: Type.STRING },
                score: { type: Type.STRING },
                status: { type: Type.STRING, description: "Live, HT, FT, Scheduled, Postponed, or Cancelled" },
                time: { type: Type.STRING },
                competition: { type: Type.STRING }
              },
              required: ["homeTeam", "awayTeam", "status", "competition"]
            }
          }
        },
        required: ["matches"]
      }
    }
  });

  // Extract sources from grounding chunks as per instructions
  const sources: GroundingSource[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Match Source",
          uri: chunk.web.uri
        });
      }
    });
  }

  // Deduplicate sources
  const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      matches: data.matches || [],
      sources: uniqueSources
    };
  } catch (e) {
    console.error("Failed to parse grounded JSON", e);
    return { matches: [], sources: uniqueSources };
  }
};
