import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { healthRisksData, getSeverityColor } from "../types/health-data";

export function RiskAssessment() {
  const [exposureType, setExposureType] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<string>("");
  const [exposureDuration, setExposureDuration] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  const handleAssessment = () => {
    if (!exposureType || !healthStatus || !exposureDuration) return;

    // Filter risks based on exposure type
    let relevantRisks = healthRisksData.filter(risk => {
      if (exposureType === "both") return true;
      return risk.exposureType.toLowerCase().includes(exposureType.toLowerCase());
    });

    // Assess risk based on duration and health status
    const assessedRisks = relevantRisks.map(risk => {
      const riskDuration = healthStatus === "healthy" ? risk.healthyRisk : risk.vulnerableRisk;
      
      // Simple risk assessment logic
      let riskLevel = "Low";
      let recommendation = "Continue monitoring";

      // Parse duration strings to assess current risk
      if (exposureDuration === "hours" && (riskDuration.includes("hour") || riskDuration.includes("12-24"))) {
        riskLevel = "High";
        recommendation = "Seek immediate medical attention";
      } else if (exposureDuration === "days" && (riskDuration.includes("day") || riskDuration.includes("1-") || riskDuration.includes("2-"))) {
        riskLevel = "Medium";
        recommendation = "Monitor symptoms closely";
      } else if (exposureDuration === "weeks" && (riskDuration.includes("week") || riskDuration.includes("7-") || riskDuration.includes("30-"))) {
        riskLevel = "Medium";
        recommendation = "Consider medical consultation";
      } else if (exposureDuration === "months" && riskDuration.includes("month")) {
        riskLevel = "High";
        recommendation = "Medical evaluation recommended";
      }

      return {
        ...risk,
        currentRiskLevel: riskLevel,
        recommendation
      };
    });

    setResults(assessedRisks.sort((a, b) => {
      const riskOrder = { "High": 3, "Medium": 2, "Low": 1 };
      return riskOrder[b.currentRiskLevel as keyof typeof riskOrder] - riskOrder[a.currentRiskLevel as keyof typeof riskOrder];
    }));
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Personal Risk Assessment
        </CardTitle>
        <CardDescription>
          Assess your health risks based on exposure duration and health status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exposure-type">Exposure Type</Label>
            <Select value={exposureType} onValueChange={setExposureType}>
              <SelectTrigger>
                <SelectValue placeholder="Select exposure type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aqi">Poor Air Quality (AQI)</SelectItem>
                <SelectItem value="water">Contaminated Water</SelectItem>
                <SelectItem value="both">Both AQI + Water</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="health-status">Health Status</Label>
            <Select value={healthStatus} onValueChange={setHealthStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select health status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Healthy Individual</SelectItem>
                <SelectItem value="vulnerable">Vulnerable Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Exposure Duration</Label>
            <Select value={exposureDuration} onValueChange={setExposureDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleAssessment} 
          className="w-full" 
          disabled={!exposureType || !healthStatus || !exposureDuration}
        >
          <Clock className="w-4 h-4 mr-2" />
          Assess My Risk
        </Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Assessment Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={index} className="border-l-4" 
                  style={{
                    borderLeftColor: result.currentRiskLevel === "High" ? "#ef4444" : 
                                   result.currentRiskLevel === "Medium" ? "#f59e0b" : "#10b981"
                  }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{result.disease}</h4>
                      <Badge className={`border ${getRiskLevelColor(result.currentRiskLevel)}`}>
                        {result.currentRiskLevel} Risk
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      {result.currentRiskLevel === "High" ? 
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" /> :
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      }
                      <div className="text-sm">
                        <p className="text-muted-foreground">{result.recommendation}</p>
                        <Badge className={`mt-1 border ${getSeverityColor(result.severity)}`}>
                          {result.severity} Condition
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}