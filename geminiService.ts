
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

// 增加安全检查防止在 process 未定义的浏览器环境下报错
const safeApiKey = typeof process !== 'undefined' ? process.env.API_KEY || '' : '';
const ai = new GoogleGenAI({ apiKey: safeApiKey });

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  const prompt = `
    ROLE: Senior UK Immigration Counsel (Global Talent Specialist).
    TASK: Critical initial assessment of eligibility under the Global Talent Visa (GTV) route.
    
    CANDIDATE DATA:
    - Route: ${data.endorsementRoute}
    - Status: ${data.yearsOfExperience}
    - Current Role: ${data.jobTitle}
    - Personal Statement Analysis: ${data.personalStatement}
    - Evidence Provided: ${fileNames.length > 0 ? fileNames.join(', ') : "None"}

    ANALYSIS PARAMETERS:
    1. PROBABILITY SCORE (0-100).
    2. PROFESSIONAL VERDICT: Rigorous legal analysis of risks and gaps.
    3. CRITERIA MAPPING: Detailed breakdown of Mandatory and Optional criteria.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a Senior Assessor for UK Home Office Endorsing Bodies. Output ONLY valid JSON matching the schema.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          probabilityScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          mandatoryCriteria: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                met: { type: Type.BOOLEAN },
                reasoning: { type: Type.STRING }
              }
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
              }
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

  return JSON.parse(response.text || "{}") as AnalysisResult;
};
