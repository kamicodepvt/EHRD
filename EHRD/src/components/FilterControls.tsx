import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  severityFilter: string;
  onSeverityChange: (value: string) => void;
  exposureFilter: string;
  onExposureChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterControls({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  exposureFilter,
  onExposureChange,
  onClearFilters
}: FilterControlsProps) {
  const hasActiveFilters = severityFilter !== "all" || exposureFilter !== "all" || searchTerm.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conditions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={severityFilter} onValueChange={onSeverityChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Mild">Mild</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Severe">Severe</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={exposureFilter} onValueChange={onExposureChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Exposure Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exposures</SelectItem>
            <SelectItem value="Poor AQI">Poor AQI</SelectItem>
            <SelectItem value="Contaminated Water">Contaminated Water</SelectItem>
            <SelectItem value="Combined AQI + Water">Combined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}