import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const COLORS: string[] = ["#f87171", "#fbbf24", "#f472b6", "#a78bfa", "#60a5fa", "#22d3ee", "#34d399"];

interface ParameterWarning {
  parameter: string;
  warnings: number;
  color: string;
}

const WarningChart = () => {
  const [chartData, setChartData] = useState<ParameterWarning[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/parameter-distribution`)
      .then((res) => res.json())
      .then((data) => {
        const coloredData = data.map((d: any, i: number) => ({
          ...d,
          color: COLORS[i % COLORS.length],
        }));
        setChartData(coloredData);
      });
  }, []);

  const totalWarnings = chartData.reduce((sum, d) => sum + d.warnings, 0);

  return (
    <div className="space-y-8">
      {/* 📊 Overview Card */}
      <Card className="shadow-lg border-none rounded-2xl bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-3 text-2xl font-semibold text-red-700">
            <div className="p-2 rounded-full bg-red-100">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <span>Warnings Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-red-600">{totalWarnings}</p>
              <p className="text-sm text-gray-500">Total Warnings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">{chartData.length}</p>
              <p className="text-sm text-gray-500">Parameters Flagged</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🥧 Pie Chart Card */}
      <Card className="shadow-lg border-none rounded-2xl bg-gradient-to-br from-white to-pink-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-3 text-2xl font-semibold text-pink-700">
            <div className="p-2 rounded-full bg-pink-100">
              <Activity className="h-5 w-5 text-pink-600" />
            </div>
            <span>Warnings by Parameter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="warnings"
                nameKey="parameter"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#333",
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarningChart;
