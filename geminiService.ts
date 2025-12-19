
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  // 严格按照文档要求在函数内获取并初始化，确保 key 始终最新
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    IMPORTANT: Provide critical, realistic feedback. Do not be overly optimistic.
  `;

  // 使用 gemini-3-flash-preview 提高响应速度，降低超时概率
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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

  if (!response.text) {
    throw new Error("No response received from AI engine.");
  }

  try {
    return JSON.parse(response.text) as AnalysisResult;
  } catch (e) {
    console.error("JSON Parse Error:", response.text);
    throw new Error("Failed to parse analysis report. Please try again.");
  }
};
