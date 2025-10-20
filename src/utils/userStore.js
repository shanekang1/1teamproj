// src/utils/userStore.js
// ✅ Supabase만 사용합니다.
import { supabase } from "../lib/supabase";

/**
 * ID(=username) 중복 여부를 Supabase의 profiles 테이블로 확인합니다.
 * @param {string} userId - 영문/숫자 조합의 ID
 * @returns {Promise<boolean>} true면 사용 중(중복), false면 사용 가능
 */
export async function isIdTaken(userId) {
  const key = String(userId || "")
    .trim()
    .toLowerCase();
  if (!key) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", key)
    .limit(1);

  if (error) {
    console.warn("isIdTaken error:", error);
    // 개발 중엔 실패 시 중복 아님으로 취급(원한다면 throw로 바꾸세요)
    return false;
  }
  return !!(data && data.length);
}
