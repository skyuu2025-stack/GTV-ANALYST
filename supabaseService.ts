
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 保存潜在客户邮箱
 */
export const saveLead = async (email: string) => {
  const { data, error } = await supabase
    .from('leads')
    .upsert([{ email }], { onConflict: 'email' });
  
  if (error) throw error;
  return data;
};

/**
 * 保存完整的评估报告
 */
export const saveAssessment = async (data: AssessmentData, result: AnalysisResult) => {
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
    console.error("Supabase Save Error:", error);
    // 虽然数据库保存失败，但不阻碍用户看到结果
  }
};

/**
 * 获取所有潜在客户 (Admin Only)
 */
export const fetchAllLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

/**
 * 获取所有评估记录 (Admin Only)
 */
export const fetchAllAssessments = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};
