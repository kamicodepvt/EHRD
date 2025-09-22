import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Droplets, Wind, Users } from "lucide-react";
import { healthRisksData } from "../types/health-data";

export function StatsOverview() {
  const severityCounts = healthRisksData.reduce((acc, risk) => {
    acc[risk.severity] = (acc[risk.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exposureCounts = healthRisksData.reduce((acc, risk) => {
    if (risk.exposureType.includes('AQI')) {
      acc.aqi = (acc.aqi || 0) + 1;
    }
    if (risk.exposureType.includes('Water')) {
      acc.water = (acc.water || 0) + 1;
    }
    if (risk.exposureType.includes('Combined')) {
      acc.combined = (acc.combined || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: "Total Health Risks",
      value: healthRisksData.length,
      icon: AlertTriangle,
      description: "Environmental health conditions",
      color: "text-orange-600"
    },
    {
      title: "Air Quality Risks",
      value: exposureCounts.aqi || 0,
      icon: Wind,
      description: "Poor AQI related conditions",
      color: "text-blue-600"
    },
    {
      title: "Water Quality Risks",
      value: exposureCounts.water || 0,
      icon: Droplets,
      description: "Contaminated water conditions",
      color: "text-cyan-600"
    },
    {
      title: "Critical Conditions",
      value: severityCounts.Critical || 0,
      icon: Users,
      description: "Life-threatening conditions",
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}