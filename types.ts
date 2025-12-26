
export interface UserProfile {
  name: string;
  email: string;
  signature: string;
  profileImage?: string;
  isLoggedIn: boolean;
  incognitoMode?: boolean;
  notifVisaDeadline?: boolean;
  notifAuditProgress?: boolean;
  notifPolicyChanges?: boolean;
  notifMarketing?: boolean;
}

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
  GUIDE_FASHION = 'guide_fashion',
  GUIDE_TECH = 'guide_tech',
  GUIDE_ARTS = 'guide_arts',
  GUIDE_ARCH = 'guide_arch',
  GUIDE_FILM = 'guide_film',
  GUIDE_SCIENCE = 'guide_science',
  PROFILE = 'profile',
  PRIVACY = 'privacy',
  CRITERIA = 'criteria',
  API_DOCS = 'api_docs',
  ABOUT_US = 'about_us'
}
