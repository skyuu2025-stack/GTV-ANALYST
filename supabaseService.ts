
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

/**
 * Enhanced environment variable lookup.
 * Checks process.env (common in cloud environments) and import.meta.env (Vite).
 */
const getAuthKey = (key: string): string => {
  const viteKey = `VITE_${key}`;
  
  // 1. Check process.env (Standard Node/Cloud Injection)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key] as string;
    if (process.env[viteKey]) return process.env[viteKey] as string;
  }
  
  // 2. Check import.meta.env (Vite Build-time Injection)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    // @ts-ignore
    if (import.meta.env[key]) return import.meta.env[key];
  }

  return "";
};

const SUPABASE_URL = getAuthKey('SUPABASE_URL');
const SUPABASE_ANON_KEY = getAuthKey('SUPABASE_ANON_KEY') || getAuthKey('SUPABASE_KEY');

// Initialize only if keys are present and valid
export const supabase = (SUPABASE_URL && SUPABASE_URL.startsWith('http')) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

/**
 * System diagnostic status for Admin Dashboard only.
 */
export const getEnvStatus = () => {
  return {
    initialized: !!supabase,
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    urlValue: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : "NONE",
    configError: (!SUPABASE_URL || !SUPABASE_ANON_KEY) 
      ? "SYSTEM_CONFIG_INCOMPLETE: Supabase URL or Anon Key is missing in environment variables." 
      : null
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
