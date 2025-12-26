
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  const prompt = `
    TASK: UK GTV Eligibility Assessment for ${data.endorsementRoute}.
    
    CANDIDATE:
    - Name: ${data.name}
    - Level: ${data.yearsOfExperience}
    - Role: ${data.jobTitle}
    - Bio: ${data.personalStatement}
    - Files: ${fileNames.join(', ')}

    INSTRUCTIONS:
    1. Evaluate against 2025 Home Office/Endorsement criteria.
    2. Score probability (0-100).
    3. Map Mandatory/Optional criteria status.
    4. Highlight evidence gaps and 3 specific steps.

    JSON ONLY.
  `;

  try {
    // Fix: Upgraded to gemini-3-pro-preview for complex reasoning task as per coding guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional GTV Endorsement AI. Output ONLY strictly valid JSON matching the defined schema. Be concise and precise.",
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
    if (err.message?.includes('429') || err.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("AI analysis engine timed out. Please check your connection and try again.");
  }
};

export const generateAILogo = async (style: string): Promise<string> => {
  const prompt = `
    Create a professional app icon for "GTV Assessor".
    White letter "G" inside a golden circular border. Onyx background.
    Theme: ${style === 'tech' ? 'Neural pathways' : 'Global travel paths'}.
    Palette: Gold, White, Onyx. Minimalist, luxury tech.
  `;

  try {
    // Fix: Using gemini-2.5-flash-image for general image generation task
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned.");
  } catch (err) {
    console.error("Logo Generation Error:", err);
    throw err;
  }
};

export const chatWithConcierge = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    // Fix: Using gemini-3-flash-preview for basic Q&A chat task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.concat([{ role: 'user', parts: [{ text: message }] }]),
      config: {
        systemInstruction: "GTV Concierge: professional, concise, focused on UK Global Talent Visa. Provide guidance, not legal advice.",
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (err) {
    console.error("Concierge Chat Error:", err);
    return "The GTV Concierge is currently offline.";
  }
};

export const searchLocalVisaSupport = async (lat: number, lng: number) => {
  const prompt = "List 3 professional immigration consultants specializing in UK GTV near this location.";
  
  try {
    // Fix: Using gemini-2.5-flash which is mandatory for Google Maps grounding tools
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
    throw new Error("Local search unavailable.");
  }
};
