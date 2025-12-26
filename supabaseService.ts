
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

/**
 * 强化版环境变量读取函数
 * 兼容 Netlify, Vercel, Vite, Create-React-App 等多种环境
 */
const safeGetEnv = (key: string): string => {
  const prefixes = ['VITE_', 'REACT_APP_', ''];
  
  try {
    for (const prefix of prefixes) {
      const fullKey = `${prefix}${key}`;
      
      // 1. 尝试 Vite 标准的 import.meta.env
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[fullKey]) {
        // @ts-ignore
        return import.meta.env[fullKey];
      }

      // 2. 尝试 Node 风格的 process.env
      if (typeof process !== 'undefined' && process.env && process.env[fullKey]) {
        return process.env[fullKey];
      }

      // 3. 尝试全局 window 对象 (某些沙盒环境注入)
      // @ts-ignore
      if (typeof window !== 'undefined' && window[fullKey]) {
        // @ts-ignore
        return window[fullKey];
      }
    }
  } catch (e) {
    console.warn(`[Supabase] Error looking up key: ${key}`, e);
  }
  return "";
};

const SUPABASE_URL = safeGetEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = safeGetEnv('SUPABASE_ANON_KEY');

// 只有当 URL 合法时才初始化客户端
export const supabase = (SUPABASE_URL && SUPABASE_URL.startsWith('http')) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

/**
 * 获取当前环境的配置状态，用于 UI 诊断
 */
export const getEnvStatus = () => {
  return {
    initialized: !!supabase,
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    urlValue: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : "NONE",
    configError: (!SUPABASE_URL || !SUPABASE_ANON_KEY) 
      ? "缺失配置：请确保在 Netlify 后台设置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 变量，并执行 Clear Cache and Deploy。" 
      : null
  };
};

// OAuth Login Helpers
export const signInWithGoogle = async () => {
  if (!supabase) return { error: new Error(getEnvStatus().configError || "Supabase 客户端未就绪") };
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
};

export const signInWithApple = async () => {
  if (!supabase) return { error: new Error(getEnvStatus().configError || "Supabase 客户端未就绪") };
  return await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: window.location.origin }
  });
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
}
