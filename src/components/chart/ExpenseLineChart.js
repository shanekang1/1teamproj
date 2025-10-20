import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseLineChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 h-[420px]">
      <h2 className="text-lg font-semibold mb-4">📆 날짜별 지출 추이</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">지출 데이터가 없습니다.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
