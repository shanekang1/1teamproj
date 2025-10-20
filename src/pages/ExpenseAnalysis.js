import React from "react";
import "../components/chart/ExpenseAnalysis.css";
import { useExpenseAnalysis } from "../components/chart/useExpenseAnalysis";
import ExpensePieChart from "../components/chart/ExpensePieChart";
import ExpenseLineChart from "../components/chart/ExpenseLineChart";

export default function ExpenseAnalysisPage() {
  const businessId = localStorage.getItem("businessId");
  const { data, loading } = useExpenseAnalysis(businessId);

  if (loading)
    return <p className="analysis-loading">분석 중...</p>;

  return (
    <div className="expense-analysis-page">
      <h1 className="expense-analysis-title">이번 달 지출 분석</h1>

      <div className="expense-analysis-container">
        <div className="analysis-card">
          <ExpensePieChart data={data.byCategory} total={data.totalExpense} />
        </div>
        <div className="analysis-card">
          <ExpenseLineChart data={data.byDate} />
        </div>
      </div>
    </div>
  );
}
