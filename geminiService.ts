
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
    if (err.message?.includes('429') || err.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("AI analysis engine timed out. Please check your connection and try again.");
  }
};

export const generateAILogo = async (style: string): Promise<string> => {
  const prompt = `
    Create a professional, modern app icon and logo for "GTV Assessor".
    The logo should feature a prominent white letter "G" inside a sophisticated golden circular border.
    Theme: ${style === 'tech' ? 'Digital Technology & AI analysis' : 'Global reach and Visa precision'}.
    Visual Elements: 
    - Incorporate subtle neural network pathways (thin golden lines) in the background.
    - A faint silhouette of a globe or travel pathways.
    - Style: Luxury tech, minimalist, high contrast. 
    - Palette: Deep Onyx black background, 24K Gold, and Pure White.
    - Composition: Centered, symmetrical, suitable for a 1024x1024 app icon.
  `;

  try {
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.concat([{ role: 'user', parts: [{ text: message }] }]),
      config: {
        systemInstruction: `You are the GTV Assessor Concierge. You are a professional, polite, and highly knowledgeable assistant specialized in the UK Global Talent Visa (GTV). 
        Help users with:
        1. Explaining the Tech Nation, Arts Council, and RIBA routes.
        2. Clarifying endorsement criteria (Mandatory/Optional).
        3. Answering questions about visa costs, duration, and ILR (Indefinite Leave to Remain) timelines.
        4. Guiding them on how to use this tool.
        
        RULES:
        - Keep answers concise and strictly related to GTV.
        - Use a professional, encouraging tone.
        - Mention that for formal legal advice, they should consult a qualified solicitor.
        - If the user asks about something unrelated, politely bring them back to GTV topics.`,
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (err) {
    console.error("Concierge Chat Error:", err);
    return "The GTV Concierge is currently offline. Please try again later.";
  }
};

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
