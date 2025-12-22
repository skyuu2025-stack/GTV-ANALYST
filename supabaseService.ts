import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

// 确保使用 VITE_ 前缀的环境变量
const FINAL_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "";
const FINAL_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabase = (FINAL_URL && FINAL_URL.startsWith('http')) 
  ? createClient(FINAL_URL, FINAL_KEY) 
  : null;

export const getEnvStatus = () => {
  return {
    hasUrl: !!FINAL_URL && FINAL_URL.length > 10,
    hasKey: !!FINAL_KEY && FINAL_KEY.length > 10,
    urlValue: FINAL_URL ? `${FINAL_URL.substring(0, 15)}...` : "NONE",
    debugInfo: "Vite Environment Engine"
  };
};

export const saveLead = async (email: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('leads')
      .upsert([{ email }], { onConflict: 'email' });
    if (error) {
      console.error("Supabase Save Error:", error.message);
      throw error;
    }
    return data;
  } catch (err) {
    throw err;
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
    if (error) {
      console.error("Supabase Assessment Save Error:", error.message);
      throw error;
    }
  } catch (err) {
    throw err;
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