
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  const prompt = `
    ROLE: Senior UK Immigration Analyst.
    TASK: Critical assessment of Global Talent Visa (GTV) eligibility for ${data.endorsementRoute}.
    
    CANDIDATE PROFILE:
    - Name: ${data.name}
    - Level: ${data.yearsOfExperience}
    - Role: ${data.jobTitle}
    - Professional Summary: ${data.personalStatement}
    - Attached Evidence Pieces: ${fileNames.length} (${fileNames.join(', ')})

    REQUIREMENTS:
    1. Benchmark against official 2025 Home Office / Endorsing Body (Tech Nation/Arts Council) criteria.
    2. Provide a probability score (0-100).
    3. Map Mandatory and Optional criteria.
    4. Identify specific evidence gaps.
    5. Generate a tactical 3-step roadmap.

    OUTPUT: Strictly valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a specialized GTV Endorsement AI. Provide objective, high-accuracy analysis. Output ONLY strictly valid JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probabilityScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            mandatoryCriteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  met: { type: Type.BOOLEAN },
                  reasoning: { type: Type.STRING }
                },
                required: ["title", "met", "reasoning"]
              }
            },
            optionalCriteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  met: { type: Type.BOOLEAN },
                  reasoning: { type: Type.STRING }
                },
                required: ["title", "met", "reasoning"]
              }
            },
            evidenceGap: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            fieldAnalysis: { type: Type.STRING }
          },
          required: ["probabilityScore", "summary", "mandatoryCriteria", "optionalCriteria", "evidenceGap", "recommendations", "fieldAnalysis"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI engine.");
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (err: any) {
    console.error("Gemini Analysis Error:", err);
    // Standardizing quota error for the UI
    if (err.message?.includes('429') || err.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("AI analysis engine timed out. Please check your connection and try again.");
  }
};

/**
 * 使用 Google Maps Grounding 寻找附近的签证支持机构
 */
export const searchLocalVisaSupport = async (lat: number, lng: number) => {
  const prompt = "List 3 professional immigration consultants or law firms near this location specializing in UK Global Talent Visa (GTV) or Tech Nation endorsements.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    console.error("Maps Grounding Error:", err);
    throw new Error("Local search unavailable. Please check location permissions.");
  }
};
