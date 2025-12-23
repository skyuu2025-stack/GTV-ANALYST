import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

/**
 * Robust environment variable retrieval for browser environments.
 * Uses multiple fallback methods to prevent ReferenceErrors.
 */
const safeGetEnv = (key: string): string => {
  try {
    // 1. Try process.env with existence check
    if (typeof process !== 'undefined' && process && process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, key)) {
        return (process.env as any)[key] as string;
      }
    }
    
    // 2. Try window.process.env
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
      return (window as any).process.env[key];
    }

    // 3. Fallback for common build tools
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // Silently fail to prevent white screen
    console.warn(`Environment retrieval for ${key} failed safely.`);
  }
  return "";
};

const SUPABASE_URL = safeGetEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = safeGetEnv('VITE_SUPABASE_ANON_KEY');

// Initialize client only if valid parameters are present
export const supabase = (SUPABASE_URL && SUPABASE_URL.startsWith('http')) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const getEnvStatus = () => {
  return {
    hasUrl: !!SUPABASE_URL && SUPABASE_URL.length > 10,
    hasKey: !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 10,
    urlValue: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : "NONE",
    debugInfo: "Ultra-Safe Browser Engine"
  };
};

export const saveLead = async (email: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('leads')
      .upsert([{ email }], { onConflict: 'email' });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase Save Lead Error:", err);
    return null;
  }
};

export const saveAssessment = async (data: AssessmentData, result: AnalysisResult) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('assessments')
      .insert([{
        name: data.name,
        email: data.email,
        route: data.endorsementRoute,
        score: result.probabilityScore,
        input_data: data,
        result_data: result
      }]);
    if (error) throw error;
  } catch (err) {
    console.error("Supabase Save Assessment Error:", err);
  }
};

export const fetchAllLeads = async () => {
  if (!supabase) return { data: [], error: 'Not connected' };
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error: error ? error.message : null };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
};

export const fetchAllAssessments = async () => {
  if (!supabase) return { data: [], error: 'Not connected' };
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error: error ? error.message : null };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
};