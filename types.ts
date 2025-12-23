export interface AssessmentData {
  name: string;
  email: string;
  endorsementRoute: string;
  jobTitle: string;
  yearsOfExperience: string;
  personalStatement: string;
  hasEvidence: boolean;
}

export interface AnalysisResult {
  probabilityScore: number;
  summary: string;
  mandatoryCriteria: {
    title: string;
    met: boolean;
    reasoning: string;
  }[];
  optionalCriteria: {
    title: string;
    met: boolean;
    reasoning: string;
  }[];
  evidenceGap: string[];
  recommendations: string[];
  fieldAnalysis: string;
}

export enum AppStep {
  LANDING = 'landing',
  FORM = 'form',
  ANALYZING = 'analyzing',
  RESULTS_FREE = 'results_free',
  PAYMENT = 'payment',
  RESULTS_PREMIUM = 'results_premium',
  GUIDE_GENERAL = 'guide_general',
  GUIDE_FASHION = 'guide_fashion'
}