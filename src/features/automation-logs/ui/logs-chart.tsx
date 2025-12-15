"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { cn } from "@/design-system/utils/cn";
import type { LogsChartData } from "../model/logs";

type LogsChartProps = {
  data: LogsChartData[];
};

type ChartType = "line" | "bar";

/**
 * 로그 차트 컴포넌트 (Recharts 사용)
 */
export function LogsChart({ data }: LogsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
          실행 현황 추이
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
              chartType === "line" && "bg-emerald-500/20 border-emerald-400/50 text-emerald-300",
              "hover:bg-white/10",
            )}
          >
            선 그래프
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition",
              chartType === "bar" && "bg-emerald-500/20 border-emerald-400/50 text-emerald-300",
              "hover:bg-white/10",
            )}
          >
            막대 그래프
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "line" ? (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => value.split("-").slice(1).join("/")}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend
              wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="success"
              stroke="#10b981"
              strokeWidth={2}
              name="성공"
              dot={{ fill: "#10b981", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke="#ef4444"
              strokeWidth={2}
              name="실패"
              dot={{ fill: "#ef4444", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#eab308"
              strokeWidth={2}
              name="대기"
              dot={{ fill: "#eab308", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="running"
              stroke="#3b82f6"
              strokeWidth={2}
              name="실행중"
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => value.split("-").slice(1).join("/")}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }} />
            <Bar dataKey="success" fill="#10b981" name="성공" radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" fill="#ef4444" name="실패" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#eab308" name="대기" radius={[4, 4, 0, 0]} />
            <Bar dataKey="running" fill="#3b82f6" name="실행중" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
