import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { HealthRisk, getSeverityColor, getExposureTypeIcon } from "../types/health-data";

interface RiskTableProps {
  risks: HealthRisk[];
}

export function RiskTable({ risks }: RiskTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Disease/Condition</TableHead>
            <TableHead>Exposure Type</TableHead>
            <TableHead>Duration to Risk</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Healthy Individuals</TableHead>
            <TableHead>Vulnerable Individuals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{risk.disease}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{getExposureTypeIcon(risk.exposureType)}</span>
                  <span className="text-sm">{risk.exposureType}</span>
                </div>
              </TableCell>
              <TableCell>{risk.durationToRisk}</TableCell>
              <TableCell>
                <Badge className={`border ${getSeverityColor(risk.severity)}`}>
                  {risk.severity}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{risk.healthyRisk}</TableCell>
              <TableCell className="text-sm">{risk.vulnerableRisk}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}