import { useCallback } from "react";
import { supabase } from "../../lib/supabase";
import moment from "moment";

export const useRevenueSave = (
  businessId,
  selectedDate,
  expenseSets,
  setExpensesByDate,
  closeModal
) => {
  const saveExpense = useCallback(async () => {
    if (!businessId) return alert("businessId가 없습니다.");
    const key = moment(selectedDate).format("YYYY-MM-DD");

    // 입력 데이터 병합
    const all = ["revenue", "expense", "labor"]
      .flatMap((t) =>
        expenseSets[t].map((x) => ({
          ...x,
          isProfit: t === "revenue",
          isMemo: false,
        }))
      )
      .concat(
        expenseSets.memo.trim()
          ? [
              {
                id: crypto.randomUUID(),
                name: expenseSets.memo.trim(),
                amount: 0,
                isProfit: false,
                isMemo: true,
              },
            ]
          : []
      )
      .filter((x) => x.name.trim());

    try {
      // 1️⃣ 기존 데이터 조회
      const { data: existing, error: fetchError } = await supabase
        .from("revenue")
        .select("*")
        .eq("business_id", businessId)
        .eq("date", key);

      if (fetchError) throw fetchError;

      const toInsert = [];
      const toUpdate = [];
      const toDelete = [];

      // 2️⃣ 추가/수정 비교
      all.forEach((item) => {
        const found = existing?.find((e) => e.revenue_text === item.name);
        if (!found) {
          toInsert.push(item);
        } else if (Number(found.revenue_amount) !== Number(item.amount)) {
          toUpdate.push({ ...item, id: found.id });
        }
      });

      // 3️⃣ 삭제할 데이터 찾기 (기존엔 있었는데 now엔 없는 경우)
      existing?.forEach((oldItem) => {
        const stillExists = all.some((a) => a.name === oldItem.revenue_text);
        if (!stillExists) toDelete.push(oldItem.id);
      });

      // ⚠️ 삭제 전 사용자 확인
      if (toDelete.length > 0) {
        const confirmed = window.confirm(
          `삭제된 항목이 ${toDelete.length}개 있습니다.\n정말 저장하시겠습니까?`
        );
        if (!confirmed) {
          alert("저장이 취소되었습니다.");
          return;
        }
      }

      // 4️⃣ DB 반영
      if (toInsert.length)
        await supabase.from("revenue").insert(
          toInsert.map((s) => ({
            id: crypto.randomUUID(),
            business_id: businessId,
            staff_id: s.staff_id || null,
            isProfit: s.isProfit,
            isMemo: s.isMemo,
            date: key,
            revenue_text: s.name,
            revenue_amount: Number(s.amount) || 0,
          }))
        );

      if (toUpdate.length)
        await Promise.all(
          toUpdate.map((s) =>
            supabase
              .from("revenue")
              .update({ revenue_amount: +s.amount })
              .eq("id", s.id)
          )
        );

      if (toDelete.length)
        await supabase.from("revenue").delete().in("id", toDelete);

      // 5️⃣ 상태 갱신
      setExpensesByDate((prev) => ({
        ...prev,
        [key]: all, // DB와 동일한 상태로 반영
      }));

      alert("저장되었습니다.");
      closeModal();
    } catch (err) {
      console.error("saveExpense 오류:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  }, [businessId, selectedDate, expenseSets, setExpensesByDate, closeModal]);

  return { saveExpense };
};
