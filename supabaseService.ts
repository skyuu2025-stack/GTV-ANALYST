
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

// 安全获取环境变量，防止未定义时崩溃
const supabaseUrl = typeof process !== 'undefined' ? process.env.SUPABASE_URL : '';
const supabaseAnonKey = typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '';

// 只有在 URL 合法时才初始化
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey || '') 
  : null;

if (!supabase) {
  console.warn("⚠️ Supabase: 环境变量 SUPABASE_URL 或 SUPABASE_ANON_KEY 缺失。请在部署平台（如 Netlify/Vercel）中配置它们。应用现在将回退到本地存储模式。");
}

/**
 * 保存潜在客户邮箱
 */
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

/**
 * 保存完整的评估报告
 */
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

/**
 * 获取所有潜在客户 (Admin Only)
 */
export const fetchAllLeads = async () => {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase Fetch Leads Error:", err);
    return [];
  }
};

/**
 * 获取所有评估记录 (Admin Only)
 */
export const fetchAllAssessments = async () => {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase Fetch Assessments Error:", err);
    return [];
  }
};
