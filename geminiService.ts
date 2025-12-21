import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, AnalysisResult } from "./types.ts";

export const analyzeVisaEligibility = async (data: AssessmentData, fileNames: string[]): Promise<AnalysisResult> => {
  // Fix: Use the process.env.API_KEY directly for initialization as per @google/genai guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    ROLE: Senior UK Immigration Counsel (Global Talent Specialist).
    TASK: Critical initial assessment of eligibility under the Global Talent Visa (GTV) route.
    
    CANDIDATE DATA:
    - Candidate: ${data.name}
    - Route: ${data.endorsementRoute}
    - Status: ${data.yearsOfExperience}
    - Role: ${data.jobTitle}
    - Summary: ${data.personalStatement}
    - Evidence Files: ${fileNames.length > 0 ? fileNames.join(', ') : "None Provided"}

    ANALYSIS PARAMETERS:
    1. PROBABILITY SCORE (0-100 integer).
    2. PROFESSIONAL VERDICT: Rigorous legal analysis of risks, evidence strength, and potential gaps.
    3. CRITERIA MAPPING: Detailed breakdown of Mandatory and Optional criteria based on Home Office guidance.

    IMPORTANT: Be realistic and critical. Do not be overly optimistic. Output only JSON matching the schema.
  `;

  try {
    // Fix: Using 'gemini-3-pro-preview' for advanced reasoning required for visa eligibility assessment.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI Immigration Consultant specialized in Global Talent Visas for Arts, Culture, and Tech. Output ONLY strictly valid JSON.",
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

    // Fix: Access .text property directly from GenerateContentResponse.
    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI engine.");
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (err: any) {
    console.error("Gemini Analysis Error:", err);
    throw new Error(err.message || "The AI Assessor encountered a processing error. Please check your connection and try again.");
  }
};