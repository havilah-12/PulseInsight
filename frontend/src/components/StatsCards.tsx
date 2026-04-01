import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, AlertCircle, CheckCircle } from "lucide-react";

const StatsCards = () => {
  const [statsData, setStatsData] = useState({
    total_patients: 0,
    active_parameters: 0,
    warnings: 0,
    resolved: 0,
  });

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/analytics-stats`)
      .then((res) => res.json())
      .then(setStatsData);
  }, []);

  const stats = [
    {
      title: "Total Patients",
      value: statsData.total_patients.toLocaleString(),
      icon: Users,
      gradient: "from-[#38bdf8] via-[#818cf8] to-[#c084fc]",
      iconColor: "text-white",
    },
    {
      title: "Medical Parameters",
      value: statsData.active_parameters.toLocaleString(),
      icon: TrendingUp,
      gradient: "from-[#6ee7b7] via-[#3b82f6] to-[#9333ea]",
      iconColor: "text-white",
    },
    {
      title: "Warnings (Out of Range)",
      value: statsData.warnings.toLocaleString(),
      icon: AlertCircle,
      gradient: "from-[#facc15] via-[#fb923c] to-[#ef4444]",
      iconColor: "text-white",
    },
    {
      title: "Healthy (In Range)",
      value: statsData.resolved.toLocaleString(),
      icon: CheckCircle,
      gradient: "from-[#34d399] via-[#10b981] to-[#059669]",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.gradient} text-white shadow-xl rounded-xl transition-all transform hover:scale-[1.03] hover:shadow-2xl`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-md">
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
