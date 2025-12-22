import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    ROLE: Senior UK Immigration Analyst.
    TASK: Critical assessment of Global Talent Visa (GTV) eligibility.
    
    DATA:
    - Name: ${data.name}
    - Route: ${data.endorsementRoute}
    - Level: ${data.yearsOfExperience}
    - Role: ${data.jobTitle}
    - Summary: ${data.personalStatement}
    - Files: ${fileNames.length}

    OUTPUT: Strictly valid JSON mapping probability and criteria.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI Immigration Consultant. Output ONLY strictly valid JSON matching the provided schema.",
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
    
    if (err.message?.includes('429') || err.message?.includes('quota')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    
    throw new Error("AI 评估遇到异常，请检查网络后重试。");
  }
};