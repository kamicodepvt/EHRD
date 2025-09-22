import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { MapPin, Navigation, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { CityData, indianCitiesData, getAQILevel, getWaterQualityColor } from "../types/location-data";

interface LocationSelectorProps {
  onLocationChange: (city: CityData | null, autoStart?: boolean) => void;
  selectedCity: CityData | null;
}

export function LocationSelector({ onLocationChange, selectedCity }: LocationSelectorProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");

  const getCurrentLocation = async () => {
    // Check for geolocation support
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    // Check for HTTPS requirement (geolocation requires secure context)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      toast.error("Geolocation requires a secure connection (HTTPS)");
      return;
    }

    // Check permissions if available
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          toast.error("Location access is blocked. Please enable location permissions in your browser settings.");
          return;
        }
      } catch (e) {
        // Permission API not supported, continue anyway
        console.log("Permissions API not supported");
      }
    }

    setIsGettingLocation(true);
    setLocationError(null);
    toast.info("🌍 Detecting your location...");
    
    try {
      // First try browser's native geolocation with enhanced settings
      const position = await getBrowserLocation();
      const { latitude, longitude } = position.coords;
      
      // Set user location for display
      setUserLocation({ lat: latitude, lng: longitude });
      
      // Enhanced reverse geocoding with multiple fallbacks
      const locationResult = await reverseGeocode(latitude, longitude);
      
      if (locationResult.nearestCity) {
        onLocationChange(locationResult.nearestCity, true);
        toast.success(
          `📍 Location detected: ${locationResult.nearestCity.name}, ${locationResult.nearestCity.state}. ` +
          `Distance: ${locationResult.distance.toFixed(1)}km. Timer started automatically!`
        );
      } else {
        // If no nearby city found, still show coordinates and allow manual selection
        toast.warning(
          `📍 Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) but no nearby city found in our database. ` +
          `Please select the closest city manually.`
        );
      }
      
      setIsGettingLocation(false);
      
    } catch (error) {
      console.error("Enhanced geolocation error:", error);
      
      // Try IP-based geolocation as fallback
      try {
        toast.info("🌐 Trying IP-based location detection...");
        const ipLocation = await getIPLocation();
        
        if (ipLocation) {
          setUserLocation({ lat: ipLocation.lat, lng: ipLocation.lng });
          const locationResult = await reverseGeocode(ipLocation.lat, ipLocation.lng);
          
          if (locationResult.nearestCity) {
            onLocationChange(locationResult.nearestCity, true);
            toast.success(
              `📍 Location detected via IP: ${locationResult.nearestCity.name}, ${locationResult.nearestCity.state}. ` +
              `(Approximate location - Distance: ${locationResult.distance.toFixed(1)}km)`
            );
          } else {
            toast.warning("📍 Approximate location detected but no nearby city found. Please select manually.");
          }
        }
      } catch (ipError) {
        console.error("IP geolocation also failed:", ipError);
        handleLocationError(error);
      }
      
      setIsGettingLocation(false);
    }
  };

  const getBrowserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      // Try high accuracy first
      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          if (error.code === error.TIMEOUT) {
            // If timeout, try with lower accuracy
            console.log("High accuracy timed out, trying with lower accuracy...");
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 300000 // 5 minutes
              }
            );
          } else {
            reject(error);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  };

  const getIPLocation = async (): Promise<{lat: number, lng: number} | null> => {
    try {
      // Using ipapi.co for IP-based geolocation (free tier, no API key required)
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`IP location service error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        };
      }
      
      return null;
    } catch (error) {
      console.error("IP location detection failed:", error);
      return null;
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<{nearestCity: CityData | null, distance: number}> => {
    // Find nearest city in our database
    let nearestCity = null;
    let minDistance = Infinity;

    for (const city of indianCitiesData) {
      const distance = calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    // Only return the city if it's reasonably close (within 100km)
    if (nearestCity && minDistance <= 100) {
      return { nearestCity, distance: minDistance };
    }

    return { nearestCity: null, distance: minDistance };
  };

  const handleLocationError = (error: any) => {
    let errorMessage = "Unable to get your location. ";
    
    if (error.code) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Location access was denied. Please enable location permissions and try again.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable. Please check your internet connection or select a city manually.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out. Please try again or select a city manually.";
          break;
        default:
          errorMessage += "Please select a city manually.";
          break;
      }
    } else {
      errorMessage += error.message || "Please select a city manually.";
    }
    
    toast.error(errorMessage);
    setLocationError(errorMessage);
  };

  const findNearestCity = (lat: number, lng: number): CityData | null => {
    let nearestCity = null;
    let minDistance = Infinity;

    for (const city of indianCitiesData) {
      const distance = calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    return nearestCity;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Group cities by state
  const stateGroups = indianCitiesData.reduce((acc, city) => {
    if (!acc[city.state]) {
      acc[city.state] = [];
    }
    acc[city.state].push(city);
    return acc;
  }, {} as Record<string, CityData[]>);

  // Get unique states
  const states = Object.keys(stateGroups).sort();

  // Get cities for selected state
  const citiesInSelectedState = selectedState ? stateGroups[selectedState] || [] : [];

  // Update selected state when city changes externally
  useEffect(() => {
    if (selectedCity && selectedCity.state !== selectedState) {
      setSelectedState(selectedCity.state);
    }
  }, [selectedCity]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    // Clear city selection when state changes
    onLocationChange(null);
  };

  const handleCityChange = (cityId: string) => {
    const city = citiesInSelectedState.find(c => c.id === cityId);
    onLocationChange(city || null);
  };

  const aqiInfo = selectedCity ? getAQILevel(selectedCity.aqi) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location & Environmental Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Button 
              onClick={getCurrentLocation} 
              disabled={isGettingLocation}
              variant="outline"
              className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 hover:from-blue-100 hover:to-green-100"
            >
              {isGettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Navigation className="w-4 h-4 text-green-600" />
              )}
              {isGettingLocation ? "🌍 Detecting Location..." : "📍 Use My Current Location"}
            </Button>
            
            {isGettingLocation && (
              <div className="space-y-2">
                <div className="text-xs text-blue-600 text-center font-medium">
                  🔍 Searching for your location...
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Please allow location access when prompted by your browser
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>• Trying high-accuracy GPS first...</div>
                    <div>• Will fallback to IP-based location if needed</div>
                    <div>• Looking for nearest city in our database</div>
                  </div>
                </div>
              </div>
            )}
            
            {locationError && !isGettingLocation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Location Detection Failed</span>
                </div>
                <p className="text-xs text-yellow-700">{locationError}</p>
                <Button 
                  onClick={getCurrentLocation} 
                  size="sm"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Try Again
                </Button>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Having trouble with location detection?
                </summary>
                <div className="mt-3 space-y-2 text-xs bg-gray-50 p-3 rounded border">
                  <div className="font-medium text-gray-800">Quick Fixes:</div>
                  <div className="space-y-1">
                    <p>• 🔒 Ensure you're on a secure connection (HTTPS)</p>
                    <p>• 📱 Enable location services on your device</p>
                    <p>• 🌐 Allow location access when prompted by browser</p>
                    <p>• 🔄 Try refreshing the page if request fails</p>
                    <p>• 🏙️ System will try IP-based location as backup</p>
                  </div>
                  
                  <div className="font-medium text-gray-800 mt-3">Browser Support:</div>
                  <div className="space-y-1">
                    <p>• ✅ Chrome, Firefox, Safari, Edge (latest versions)</p>
                    <p>• ⚠️ Some older browsers may have limited support</p>
                    <p>• 📱 Mobile browsers generally work well</p>
                  </div>
                  
                  <div className="font-medium text-gray-800 mt-3">Accuracy Information:</div>
                  <div className="space-y-1">
                    <p>• 🎯 GPS: Most accurate (within meters)</p>
                    <p>• 📶 Cell towers: Moderate accuracy (within km)</p>
                    <p>• 🌐 IP-based: Approximate (city/region level)</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <p className="text-blue-700 font-medium">💡 Pro Tip:</p>
                    <p className="text-blue-600">If automatic detection fails, manually select your city from the dropdown below for the most accurate environmental data.</p>
                  </div>
                </div>
              </details>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium block">Select Location Manually</label>
            
            {/* State Selector */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">State</label>
              <Select 
                value={selectedState} 
                onValueChange={handleStateChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state} ({stateGroups[state].length} {stateGroups[state].length === 1 ? 'city' : 'cities'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City/District Selector */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">City/District</label>
              <Select 
                value={selectedCity?.id || ""} 
                onValueChange={handleCityChange}
                disabled={!selectedState}
              >
                <SelectTrigger className="w-full">
                  <SelectValue 
                    placeholder={
                      selectedState 
                        ? "Choose a city/district" 
                        : "Select a state first"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {citiesInSelectedState.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {userLocation && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Your Location Detected</span>
              </div>
              <div className="text-xs space-y-1">
                <div>📍 Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</div>
                <div className="text-blue-600">✅ Location services are working correctly</div>
              </div>
            </div>
            
            {selectedCity && (
              <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded border border-green-200">
                🎯 Matched to nearest city: <span className="font-medium">{selectedCity.name}</span>
                <div>Distance from your location: {calculateDistance(
                  userLocation.lat, 
                  userLocation.lng, 
                  selectedCity.coordinates.lat, 
                  selectedCity.coordinates.lng
                ).toFixed(1)}km</div>
              </div>
            )}
          </div>
        )}

        {selectedCity && (
          <div className="space-y-4 mt-4 border-t pt-4">
            <div>
              <h4 className="font-medium mb-2">{selectedCity.name}, {selectedCity.state}</h4>
              <div className="text-sm text-muted-foreground mb-3">
                Population: {selectedCity.population.toLocaleString()} | 
                Coordinates: {selectedCity.coordinates.lat.toFixed(2)}, {selectedCity.coordinates.lng.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Air Quality Index</span>
                  <Badge className={`border ${aqiInfo?.color}`}>
                    {selectedCity.aqi} AQI
                  </Badge>
                </div>
                {aqiInfo && (
                  <div className="text-xs text-muted-foreground">
                    {aqiInfo.level}: {aqiInfo.description}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Water Quality</span>
                  <Badge className={`border ${getWaterQualityColor(selectedCity.waterQuality)}`}>
                    {selectedCity.waterQuality}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-sm font-medium">Air Pollution</div>
                <div className="text-lg font-bold text-red-600">
                  {selectedCity.riskFactors.airPollution}/10
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Water Risk</div>
                <div className="text-lg font-bold text-blue-600">
                  {selectedCity.riskFactors.waterContamination}/10
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Industrial</div>
                <div className="text-lg font-bold text-orange-600">
                  {selectedCity.riskFactors.industrialActivity}/10
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}