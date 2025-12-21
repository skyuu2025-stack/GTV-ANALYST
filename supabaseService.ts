import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

// 在 Vite 构建工具中，必须使用 import.meta.env 来访问 VITE_ 开头的环境变量
// 确保你在 Netlify 设置的变量名是 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
// Fix: Access env via any cast to resolve "Property 'env' does not exist on type 'ImportMeta'" errors.
const FINAL_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "";
const FINAL_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "";

// 初始化 Supabase 客户端
export const supabase = (FINAL_URL && FINAL_URL.startsWith('http')) 
  ? createClient(FINAL_URL, FINAL_KEY) 
  : null;

/**
 * 提供给管理面板的诊断信息
 */
export const getEnvStatus = () => {
  return {
    hasUrl: !!FINAL_URL && FINAL_URL.length > 10,
    hasKey: !!FINAL_KEY && FINAL_KEY.length > 10,
    urlValue: FINAL_URL ? `${FINAL_URL.substring(0, 15)}...` : "NONE",
    debugInfo: "Vite Environment Engine: import.meta.env"
  };
};

if (!supabase) {
  console.warn("⚠️ DATABASE OFFLINE: 请确保在 Netlify 后台设置了 VITE_ 开头的环境变量。");
}

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
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase Fetch Leads Error:", err);
    return [];
  }
};

export const fetchAllAssessments = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('assessments').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase Fetch Assessments Error:", err);
    return [];
  }
};