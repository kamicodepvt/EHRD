import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Clock, AlertTriangle, Play, Pause, RotateCcw, Calendar } from "lucide-react";
import { Progress } from "./ui/progress";
import { CityData, calculateRiskScore } from "../types/location-data";
import { healthRisksData } from "../types/health-data";

interface HealthTimerProps {
  selectedCity: CityData | null;
  shouldStartTimer?: boolean;
  onTimerStarted?: () => void;
}

interface TimerState {
  startTime: number;
  elapsedTime: number;
  isRunning: boolean;
  totalDuration: number; // Total duration for countdown in milliseconds
}

interface RiskPrediction {
  condition: string;
  timeToRisk: number; // in hours
  severity: string;
  recommendation: string;
}

export function HealthTimer({ selectedCity, shouldStartTimer, onTimerStarted }: HealthTimerProps) {
  const [timer, setTimer] = useState<TimerState>({
    startTime: 0,
    elapsedTime: 0,
    isRunning: false,
    totalDuration: 24 * 60 * 60 * 1000 // Default 24 hours
  });
  const [healthProfile, setHealthProfile] = useState<'healthy' | 'vulnerable'>('healthy');
  const [exposureType, setExposureType] = useState<'aqi' | 'water' | 'both'>('both');
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [countdownDuration, setCountdownDuration] = useState<number>(24); // hours

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  useEffect(() => {
    if (selectedCity) {
      calculateRiskPredictions();
    }
  }, [selectedCity, healthProfile, exposureType]);

  // Auto-start timer when location is detected
  useEffect(() => {
    if (shouldStartTimer && selectedCity && !timer.isRunning) {
      startTimer();
      onTimerStarted?.();
    }
  }, [shouldStartTimer, selectedCity]);

  const startTimer = () => {
    const now = Date.now();
    const totalMs = countdownDuration * 60 * 60 * 1000; // Convert hours to milliseconds
    setTimer(prev => ({
      startTime: now - prev.elapsedTime,
      elapsedTime: prev.elapsedTime,
      isRunning: true,
      totalDuration: totalMs
    }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    const totalMs = countdownDuration * 60 * 60 * 1000;
    setTimer({
      startTime: 0,
      elapsedTime: 0,
      isRunning: false,
      totalDuration: totalMs
    });
  };

  const calculateRiskPredictions = () => {
    if (!selectedCity) return;

    const cityRisk = calculateRiskScore(selectedCity);
    const riskMultiplier = cityRisk / 5; // Scale to risk multiplier

    // Filter health risks based on exposure type
    let relevantRisks = healthRisksData.filter(risk => {
      if (exposureType === 'aqi') return risk.exposureType.includes('AQI');
      if (exposureType === 'water') return risk.exposureType.includes('Water');
      return true; // 'both' includes all risks
    });

    const predictions = relevantRisks.map(risk => {
      // Parse duration strings to hours
      const riskData = healthProfile === 'healthy' ? risk.healthyRisk : risk.vulnerableRisk;
      let baseHours = parseRiskDuration(riskData);
      
      // Adjust based on city risk score
      const adjustedHours = Math.max(1, Math.round(baseHours / riskMultiplier));

      return {
        condition: risk.disease,
        timeToRisk: adjustedHours,
        severity: risk.severity,
        recommendation: getRecommendation(risk.severity, adjustedHours)
      };
    }).sort((a, b) => a.timeToRisk - b.timeToRisk);

    setRiskPredictions(predictions);
  };

  const parseRiskDuration = (duration: string): number => {
    // Convert duration strings to hours
    if (duration.includes('hour')) {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 12;
    }
    if (duration.includes('day')) {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) * 24 : 24;
    }
    if (duration.includes('week')) {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) * 168 : 168;
    }
    if (duration.includes('month')) {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) * 720 : 720;
    }
    if (duration.includes('year')) {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) * 8760 : 8760;
    }
    return 24; // Default to 24 hours
  };

  const getRecommendation = (severity: string, hours: number): string => {
    if (hours <= 24 && (severity === 'Severe' || severity === 'Critical')) {
      return 'Seek immediate medical attention';
    }
    if (hours <= 72 && severity === 'Moderate') {
      return 'Monitor symptoms closely';
    }
    if (hours <= 168) {
      return 'Consider medical consultation';
    }
    return 'Continue monitoring and take preventive measures';
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCountdownTime = () => {
    const remaining = Math.max(0, timer.totalDuration - timer.elapsedTime);
    return remaining;
  };

  const getRemainingHours = () => {
    const remaining = getCountdownTime();
    return remaining / (1000 * 60 * 60);
  };

  const getProgressPercentage = () => {
    if (timer.totalDuration === 0) return 0;
    const progress = (timer.elapsedTime / timer.totalDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getCurrentRisks = () => {
    if (timer.elapsedTime === 0) return [];
    
    const currentHours = timer.elapsedTime / (1000 * 60 * 60);
    return riskPredictions.filter(risk => currentHours >= risk.timeToRisk - 2); // Show risks within 2 hours
  };

  const getNextRisk = () => {
    const currentHours = timer.elapsedTime / (1000 * 60 * 60);
    return riskPredictions.find(risk => risk.timeToRisk > currentHours);
  };

  if (!selectedCity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Health Risk Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Please select a location to start health risk monitoring
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRisks = getCurrentRisks();
  const nextRisk = getNextRisk();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Health Risk Timer - {selectedCity.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Health Profile</label>
              <Select value={healthProfile} onValueChange={(value: 'healthy' | 'vulnerable') => setHealthProfile(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy Individual</SelectItem>
                  <SelectItem value="vulnerable">Vulnerable Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Exposure Type</label>
              <Select value={exposureType} onValueChange={(value: 'aqi' | 'water' | 'both') => setExposureType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aqi">Air Quality Only</SelectItem>
                  <SelectItem value="water">Water Quality Only</SelectItem>
                  <SelectItem value="both">Both AQI + Water</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Countdown Duration</label>
              <Select 
                value={countdownDuration.toString()} 
                onValueChange={(value) => {
                  const newDuration = parseInt(value);
                  setCountdownDuration(newDuration);
                  if (!timer.isRunning) {
                    setTimer(prev => ({ ...prev, totalDuration: newDuration * 60 * 60 * 1000 }));
                  }
                }}
                disabled={timer.isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="3">3 Hours</SelectItem>
                  <SelectItem value="6">6 Hours</SelectItem>
                  <SelectItem value="12">12 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="48">48 Hours</SelectItem>
                  <SelectItem value="72">72 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Time Until Healthcare Needed</div>
              <div className={`text-4xl font-mono font-bold ${getCountdownTime() <= 60000 ? 'text-red-600' : getCountdownTime() <= 300000 ? 'text-orange-600' : ''}`}>
                {formatTime(getCountdownTime())}
              </div>
              <div className="w-full max-w-md mx-auto space-y-2">
                <Progress 
                  value={getProgressPercentage()} 
                  className={`h-3 ${getProgressPercentage() > 80 ? 'bg-red-100' : getProgressPercentage() > 60 ? 'bg-orange-100' : 'bg-green-100'}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>{getProgressPercentage().toFixed(0)}% elapsed</span>
                  <span>{countdownDuration}h</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Exposure Time: {formatTime(timer.elapsedTime)}
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              {!timer.isRunning ? (
                <Button onClick={startTimer} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Countdown Timer
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary" className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  Pause Timer
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {getCountdownTime() <= 0 && timer.isRunning && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <h5 className="font-medium text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  ⚠️ IMMEDIATE MEDICAL ATTENTION REQUIRED
                </h5>
                <p className="text-sm text-red-700 mt-1">
                  Your exposure duration has exceeded safe limits. Please seek medical attention immediately.
                </p>
              </div>
            )}
          </div>

          {timer.elapsedTime > 0 && (
            <div className="border-t pt-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 inline mr-1" />
                Exposure Duration: {Math.floor(timer.elapsedTime / (1000 * 60 * 60))}h {Math.floor((timer.elapsedTime % (1000 * 60 * 60)) / (1000 * 60))}m
              </div>

              {nextRisk && getRemainingHours() > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h5 className="font-medium text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Next Risk Alert
                  </h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    <strong>{nextRisk.condition}</strong> risk expected in {Math.max(0, Math.round(nextRisk.timeToRisk - (timer.elapsedTime / (1000 * 60 * 60))))} hours
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">{nextRisk.recommendation}</p>
                </div>
              )}

              {currentRisks.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h5 className="font-medium text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Current Health Risks ({currentRisks.length})
                  </h5>
                  <div className="space-y-2 mt-2">
                    {currentRisks.slice(0, 3).map((risk, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-red-700">{risk.condition}</span>
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            {risk.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-red-600 mt-1">{risk.recommendation}</p>
                      </div>
                    ))}
                    {currentRisks.length > 3 && (
                      <p className="text-xs text-red-600">+ {currentRisks.length - 3} more conditions at risk</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {riskPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Timeline Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskPredictions.slice(0, 5).map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <h5 className="font-medium">{risk.condition}</h5>
                    <p className="text-sm text-muted-foreground">{risk.recommendation}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{risk.timeToRisk}h</div>
                    <Badge className={`text-xs ${
                      risk.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                      risk.severity === 'Severe' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      risk.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {risk.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}