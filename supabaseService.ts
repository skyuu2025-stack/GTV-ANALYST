
import { createClient } from '@supabase/supabase-js';
import { AssessmentData, AnalysisResult } from './types.ts';

/**
 * 注意：在前端环境中，process.env.XXX 通常在构建时被静态替换。
 * 请确保在 Netlify/Vercel 的 Environment Variables 中已添加：
 * SUPABASE_URL
 * SUPABASE_ANON_KEY
 */

// 直接尝试读取，以便构建工具进行静态分析替换
const URL = process.env.SUPABASE_URL || "";
const KEY = process.env.SUPABASE_ANON_KEY || "";

// 只有当 URL 存在时才初始化，否则保持为 null
export const supabase = (URL && URL !== "") 
  ? createClient(URL, KEY) 
  : null;

// 用于管理面板调试
export const getEnvStatus = () => ({
  hasUrl: !!URL && URL.length > 10,
  hasKey: !!KEY && KEY.length > 10,
  urlValue: URL ? `${URL.substring(0, 12)}...` : "Empty"
});

if (!supabase) {
  console.warn("⚠️ Supabase Client 无法初始化。请检查环境变量配置。");
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
 * 获取所有潜在客户
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
 * 获取所有评估记录
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
