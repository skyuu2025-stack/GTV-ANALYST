
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

/**
 * Enhanced environment variable retrieval.
 * Tries VITE_ prefix first (standard for Vite), then fallbacks to raw keys.
 */
const safeGetEnv = (key: string): string => {
  const viteKey = `VITE_${key}`;
  
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      // @ts-ignore
      if (import.meta.env[key]) return import.meta.env[key];
    }

    if (typeof process !== 'undefined' && process.env) {
      if (process.env[viteKey]) return process.env[viteKey];
      if (process.env[key]) return process.env[key];
    }
  } catch (e) {
    console.warn(`Environment lookup for ${key} failed.`);
  }
  return "";
};

const SUPABASE_URL = safeGetEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = safeGetEnv('SUPABASE_ANON_KEY');

// Initialize client
export const supabase = (SUPABASE_URL && SUPABASE_URL.startsWith('http')) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// OAuth Login Helpers
export const signInWithGoogle = async () => {
  if (!supabase) return;
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};

export const signInWithApple = async () => {
  if (!supabase) return;
  return await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin
    }
  });
};

export const getEnvStatus = () => {
  return {
    hasUrl: !!SUPABASE_URL && SUPABASE_URL.length > 10,
    hasKey: !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 10,
    urlValue: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 10)}...` : "NONE",
    isVitePrefixed: SUPABASE_URL === safeGetEnv('VITE_SUPABASE_URL')
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
