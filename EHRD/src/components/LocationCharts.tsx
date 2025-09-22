import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { CityData, indianCitiesData, calculateRiskScore, getAQILevel } from "../types/location-data";

interface LocationChartsProps {
  selectedCity: CityData | null;
}

export function LocationCharts({ selectedCity }: LocationChartsProps) {
  // Prepare data for charts
  const cityComparisonData = indianCitiesData.map(city => ({
    name: city.name,
    aqi: city.aqi,
    riskScore: calculateRiskScore(city),
    population: Math.round(city.population / 1000000), // In millions
    airPollution: city.riskFactors.airPollution,
    waterContamination: city.riskFactors.waterContamination,
    industrialActivity: city.riskFactors.industrialActivity
  })).sort((a, b) => b.aqi - a.aqi);

  // AQI distribution data
  const aqiDistribution = [
    { name: 'Good', fullName: 'Good (0-50)', value: indianCitiesData.filter(city => city.aqi <= 50).length, color: '#10b981' },
    { name: 'Moderate', fullName: 'Moderate (51-100)', value: indianCitiesData.filter(city => city.aqi > 50 && city.aqi <= 100).length, color: '#f59e0b' },
    { name: 'Unhealthy+', fullName: 'Unhealthy for Sensitive (101-150)', value: indianCitiesData.filter(city => city.aqi > 100 && city.aqi <= 150).length, color: '#f97316' },
    { name: 'Unhealthy', fullName: 'Unhealthy (151-200)', value: indianCitiesData.filter(city => city.aqi > 150 && city.aqi <= 200).length, color: '#ef4444' },
    { name: 'Very Unhealthy', fullName: 'Very Unhealthy (201-300)', value: indianCitiesData.filter(city => city.aqi > 200 && city.aqi <= 300).length, color: '#8b5cf6' },
    { name: 'Hazardous', fullName: 'Hazardous (>300)', value: indianCitiesData.filter(city => city.aqi > 300).length, color: '#7f1d1d' }
  ].filter(item => item.value > 0);

  // Water quality distribution
  const waterQualityData = [
    { name: 'Good', value: indianCitiesData.filter(city => city.waterQuality === 'Good').length, color: '#10b981' },
    { name: 'Moderate', value: indianCitiesData.filter(city => city.waterQuality === 'Moderate').length, color: '#f59e0b' },
    { name: 'Poor', value: indianCitiesData.filter(city => city.waterQuality === 'Poor').length, color: '#f97316' },
    { name: 'Very Poor', value: indianCitiesData.filter(city => city.waterQuality === 'Very Poor').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Radar chart data for selected city
  const selectedCityRadarData = selectedCity ? [
    {
      factor: 'Air Pollution',
      value: selectedCity.riskFactors.airPollution,
      fullMark: 10
    },
    {
      factor: 'Water Contamination',
      value: selectedCity.riskFactors.waterContamination,
      fullMark: 10
    },
    {
      factor: 'Industrial Activity',
      value: selectedCity.riskFactors.industrialActivity,
      fullMark: 10
    },
    {
      factor: 'AQI Level',
      value: Math.min(selectedCity.aqi / 50, 10),
      fullMark: 10
    },
    {
      factor: 'Population Density',
      value: Math.min(selectedCity.population / 5000000, 10),
      fullMark: 10
    }
  ] : [];

  // Simulated timeline data (would normally come from historical data)
  const timelineData = [
    { time: '6 AM', aqi: selectedCity ? selectedCity.aqi - 20 : 150 },
    { time: '9 AM', aqi: selectedCity ? selectedCity.aqi - 10 : 160 },
    { time: '12 PM', aqi: selectedCity ? selectedCity.aqi : 170 },
    { time: '3 PM', aqi: selectedCity ? selectedCity.aqi + 15 : 185 },
    { time: '6 PM', aqi: selectedCity ? selectedCity.aqi + 25 : 195 },
    { time: '9 PM', aqi: selectedCity ? selectedCity.aqi + 10 : 180 },
    { time: '12 AM', aqi: selectedCity ? selectedCity.aqi - 5 : 165 },
    { time: '3 AM', aqi: selectedCity ? selectedCity.aqi - 15 : 155 }
  ];

  return (
    <div className="space-y-6">
      {/* City Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              AQI Comparison Across Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'aqi' ? `${value} AQI` : value,
                    name === 'aqi' ? 'Air Quality Index' : name
                  ]}
                />
                <Bar dataKey="aqi" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Risk Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Risk Score']}
                />
                <Bar dataKey="riskScore" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              AQI Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={aqiDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => value > 0 ? `${value}` : ''}
                  outerRadius={90}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {aqiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} cities`, 
                    props.payload.fullName || props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {aqiDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="flex-1">{item.fullName}</span>
                  <span className="font-medium">{item.value} cities</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Water Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={waterQualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => value > 0 ? `${value}` : ''}
                  outerRadius={90}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {waterQualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} cities`, `${name} Water Quality`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {waterQualityData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="flex-1">{item.name} Water Quality</span>
                  <span className="font-medium">{item.value} cities</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected City Specific Charts */}
      {selectedCity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {selectedCity.name} - Risk Factor Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={selectedCityRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={18} domain={[0, 10]} />
                  <Radar
                    name="Risk Level"
                    dataKey="value"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {selectedCity.riskFactors.airPollution}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Air Pollution</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {selectedCity.riskFactors.waterContamination}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Water Risk</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {selectedCity.riskFactors.industrialActivity}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Industrial</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Daily AQI Pattern - {selectedCity.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} AQI`, 'Air Quality Index']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Current AQI: 
                  <Badge className={`ml-2 border ${getAQILevel(selectedCity.aqi).color}`}>
                    {selectedCity.aqi}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Risk Score: 
                  <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                    {calculateRiskScore(selectedCity)}/10
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Quality Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Math.round(indianCitiesData.reduce((acc, city) => acc + city.aqi, 0) / indianCitiesData.length)}
              </div>
              <div className="text-sm text-muted-foreground">Average AQI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {indianCitiesData.filter(city => city.aqi > 150).length}
              </div>
              <div className="text-sm text-muted-foreground">Cities with Unhealthy Air</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {indianCitiesData.filter(city => city.waterQuality === 'Poor' || city.waterQuality === 'Very Poor').length}
              </div>
              <div className="text-sm text-muted-foreground">Cities with Poor Water</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(indianCitiesData.reduce((acc, city) => acc + calculateRiskScore(city), 0) / indianCitiesData.length * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Average Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}