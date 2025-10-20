import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function ExpensePieChart({ data, total }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 h-[420px]">
      <h2 className="text-lg font-semibold mb-4">💸 항목별 지출 비중</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">지출 내역이 없습니다.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <p className="text-center text-sm text-gray-600 mt-3">
            총 지출:{" "}
            <span className="font-semibold text-red-600">
              {total.toLocaleString()}원
            </span>
          </p>
        </>
      )}
    </div>
  );
}
