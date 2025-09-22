import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Users, UserCheck, AlertTriangle } from "lucide-react";
import { HealthRisk, getSeverityColor, getExposureTypeIcon } from "../types/health-data";

interface RiskCardProps {
  risk: HealthRisk;
}

export function RiskCard({ risk }: RiskCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{risk.disease}</CardTitle>
          <span className="text-2xl">{getExposureTypeIcon(risk.exposureType)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {risk.exposureType}
          </Badge>
          <Badge className={`text-xs border ${getSeverityColor(risk.severity)}`}>
            {risk.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Risk Timeline:</span>
          <span>{risk.durationToRisk}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <UserCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-700">Healthy Individuals</p>
              <p className="text-sm text-muted-foreground">{risk.healthyRisk}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-700">Vulnerable Individuals</p>
              <p className="text-sm text-muted-foreground">{risk.vulnerableRisk}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}