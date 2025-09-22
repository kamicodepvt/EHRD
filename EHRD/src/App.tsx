import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Activity, Table, BarChart3, Calculator, MapPin } from "lucide-react";
import { StatsOverview } from "./components/StatsOverview";
import { RiskTable } from "./components/RiskTable";
import { RiskCard } from "./components/RiskCard";
import { RiskAssessment } from "./components/RiskAssessment";
import { FilterControls } from "./components/FilterControls";
import { LocationSelector } from "./components/LocationSelector";
import { HealthTimer } from "./components/HealthTimer";
import { LocationCharts } from "./components/LocationCharts";
import { AIHealthAssessment } from "./components/AIHealthAssessment";
import { healthRisksData } from "./types/health-data";
import { CityData } from "./types/location-data";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [exposureFilter, setExposureFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [shouldStartTimer, setShouldStartTimer] = useState(false);

  // Filter health risks based on search and filters
  const filteredRisks = healthRisksData.filter(risk => {
    const matchesSearch = risk.disease.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || risk.severity === severityFilter;
    const matchesExposure = exposureFilter === "all" || risk.exposureType === exposureFilter;
    
    return matchesSearch && matchesSeverity && matchesExposure;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSeverityFilter("all");
    setExposureFilter("all");
  };

  const handleLocationChange = (city: CityData | null, autoStart: boolean = false) => {
    setSelectedCity(city);
    if (autoStart && city) {
      setShouldStartTimer(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Environmental Health Risk Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive health risk assessment from environmental exposure in India. 
            Track duration-based risks from poor air quality and contaminated water sources.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🌫️ Air Quality Monitoring
            </Badge>
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
              💧 Water Quality Assessment
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              ⚠️ Combined Risk Analysis
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Tracking
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="w-4 h-4" />
              Data Table
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Risk Cards
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Risk Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Health Assessment */}
            <AIHealthAssessment />
            
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  Important findings from environmental health risk analysis in India
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">⚠️ Critical Findings</h4>
                    <p className="text-sm text-red-700">
                      Vulnerable individuals can experience severe health effects within hours to days of exposure, 
                      particularly for respiratory conditions and water-borne diseases.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">🕐 Duration Matters</h4>
                    <p className="text-sm text-orange-700">
                      Even healthy individuals face significant risks with chronic exposure. 
                      Dual exposure (AQI + Water) accelerates health deterioration dramatically.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">👥 Vulnerable Groups</h4>
                    <p className="text-sm text-blue-700">
                      Children, elderly, and individuals with pre-existing conditions like asthma, 
                      COPD, or heart disease require immediate protection measures.
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">📊 Interpretation Guidelines</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• <strong>Healthy individuals</strong> may tolerate longer exposure but chronic exposure still leads to serious outcomes</p>
                    <p>• <strong>Vulnerable individuals</strong> can experience severe effects in hours to days</p>
                    <p>• <strong>Dual exposure</strong> (poor AQI + contaminated water) significantly accelerates health deterioration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <LocationSelector 
                  onLocationChange={handleLocationChange}
                  selectedCity={selectedCity}
                />
              </div>
              <div className="xl:col-span-2">
                <HealthTimer 
                  selectedCity={selectedCity} 
                  shouldStartTimer={shouldStartTimer}
                  onTimerStarted={() => setShouldStartTimer(false)}
                />
              </div>
            </div>
            
            <LocationCharts selectedCity={selectedCity} />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Health Risk Data</CardTitle>
                <CardDescription>
                  Comprehensive table showing all environmental health risks with duration-based severity levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterControls
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  severityFilter={severityFilter}
                  onSeverityChange={setSeverityFilter}
                  exposureFilter={exposureFilter}
                  onExposureChange={setExposureFilter}
                  onClearFilters={clearFilters}
                />
                <div className="mt-6">
                  <RiskTable risks={filteredRisks} />
                </div>
                {filteredRisks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No health risks match your current filters. Try adjusting your search criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Risk Cards</CardTitle>
                <CardDescription>
                  Visual representation of each health condition with detailed risk timelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterControls
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  severityFilter={severityFilter}
                  onSeverityChange={setSeverityFilter}
                  exposureFilter={exposureFilter}
                  onExposureChange={setExposureFilter}
                  onClearFilters={clearFilters}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredRisks.map((risk, index) => (
                    <RiskCard key={index} risk={risk} />
                  ))}
                </div>
                {filteredRisks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No health risks match your current filters. Try adjusting your search criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <RiskAssessment />
            
            <Card>
              <CardHeader>
                <CardTitle>Assessment Guidelines</CardTitle>
                <CardDescription>
                  Important information for interpreting your risk assessment results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Risk Levels Explained</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>
                        <span>Immediate medical attention recommended</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>
                        <span>Monitor symptoms and consider consultation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>
                        <span>Continue monitoring, maintain precautions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">When to Seek Help</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Persistent respiratory symptoms (cough, shortness of breath)</li>
                      <li>• Severe digestive issues from water exposure</li>
                      <li>• Skin irritation or rashes that worsen</li>
                      <li>• Any symptoms that persist or worsen over time</li>
                      <li>• Multiple symptoms appearing simultaneously</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            This dashboard provides general health risk information based on environmental exposure data for India. 
            Always consult healthcare professionals for personalized medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}