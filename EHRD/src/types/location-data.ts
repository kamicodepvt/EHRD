export interface CityData {
  id: string;
  name: string;
  state: string;
  aqi: number;
  waterQuality: 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  riskFactors: {
    airPollution: number; // 1-10 scale
    waterContamination: number; // 1-10 scale
    industrialActivity: number; // 1-10 scale
  };
}

export const indianCitiesData: CityData[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    aqi: 342,
    waterQuality: 'Poor',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    population: 32900000,
    riskFactors: { airPollution: 9, waterContamination: 7, industrialActivity: 8 }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    aqi: 178,
    waterQuality: 'Moderate',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    population: 20700000,
    riskFactors: { airPollution: 6, waterContamination: 5, industrialActivity: 7 }
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    aqi: 198,
    waterQuality: 'Poor',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    population: 14850000,
    riskFactors: { airPollution: 7, waterContamination: 8, industrialActivity: 6 }
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    aqi: 145,
    waterQuality: 'Moderate',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    population: 11000000,
    riskFactors: { airPollution: 5, waterContamination: 6, industrialActivity: 5 }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    aqi: 134,
    waterQuality: 'Moderate',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    population: 13600000,
    riskFactors: { airPollution: 4, waterContamination: 5, industrialActivity: 6 }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    aqi: 156,
    waterQuality: 'Moderate',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    population: 10500000,
    riskFactors: { airPollution: 5, waterContamination: 4, industrialActivity: 5 }
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    aqi: 189,
    waterQuality: 'Poor',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    population: 8400000,
    riskFactors: { airPollution: 6, waterContamination: 6, industrialActivity: 7 }
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    aqi: 167,
    waterQuality: 'Moderate',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    population: 7400000,
    riskFactors: { airPollution: 5, waterContamination: 4, industrialActivity: 6 }
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    aqi: 278,
    waterQuality: 'Very Poor',
    coordinates: { lat: 26.4499, lng: 80.3319 },
    population: 3700000,
    riskFactors: { airPollution: 8, waterContamination: 9, industrialActivity: 8 }
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    aqi: 234,
    waterQuality: 'Poor',
    coordinates: { lat: 26.8467, lng: 80.9462 },
    population: 3400000,
    riskFactors: { airPollution: 7, waterContamination: 7, industrialActivity: 6 }
  },
  // Cities with Good Air Quality and Water
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    aqi: 42,
    waterQuality: 'Good',
    coordinates: { lat: 30.7333, lng: 76.7794 },
    population: 1160000,
    riskFactors: { airPollution: 2, waterContamination: 2, industrialActivity: 3 }
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    aqi: 35,
    waterQuality: 'Good',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    population: 220000,
    riskFactors: { airPollution: 1, waterContamination: 1, industrialActivity: 2 }
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    aqi: 28,
    waterQuality: 'Good',
    coordinates: { lat: 32.2396, lng: 77.1887 },
    population: 45000,
    riskFactors: { airPollution: 1, waterContamination: 1, industrialActivity: 1 }
  },
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    aqi: 31,
    waterQuality: 'Good',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    population: 110000,
    riskFactors: { airPollution: 1, waterContamination: 2, industrialActivity: 2 }
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    aqi: 48,
    waterQuality: 'Good',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    population: 2200000,
    riskFactors: { airPollution: 2, waterContamination: 2, industrialActivity: 3 }
  },
  // Cities with Moderate conditions
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    aqi: 68,
    waterQuality: 'Good',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    population: 2200000,
    riskFactors: { airPollution: 3, waterContamination: 2, industrialActivity: 4 }
  },
  {
    id: 'mysore',
    name: 'Mysore',
    state: 'Karnataka',
    aqi: 55,
    waterQuality: 'Good',
    coordinates: { lat: 12.2958, lng: 76.6394 },
    population: 920000,
    riskFactors: { airPollution: 2, waterContamination: 2, industrialActivity: 3 }
  },
  {
    id: 'trivandrum',
    name: 'Trivandrum',
    state: 'Kerala',
    aqi: 52,
    waterQuality: 'Good',
    coordinates: { lat: 8.5241, lng: 76.9366 },
    population: 1700000,
    riskFactors: { airPollution: 2, waterContamination: 3, industrialActivity: 3 }
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    aqi: 89,
    waterQuality: 'Moderate',
    coordinates: { lat: 20.2961, lng: 85.8245 },
    population: 880000,
    riskFactors: { airPollution: 3, waterContamination: 4, industrialActivity: 4 }
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    aqi: 76,
    waterQuality: 'Moderate',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    population: 960000,
    riskFactors: { airPollution: 3, waterContamination: 4, industrialActivity: 3 }
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    aqi: 118,
    waterQuality: 'Moderate',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    population: 3300000,
    riskFactors: { airPollution: 4, waterContamination: 4, industrialActivity: 5 }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    aqi: 142,
    waterQuality: 'Moderate',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    population: 3900000,
    riskFactors: { airPollution: 5, waterContamination: 4, industrialActivity: 5 }
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    aqi: 78,
    waterQuality: 'Good',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    population: 475000,
    riskFactors: { airPollution: 3, waterContamination: 2, industrialActivity: 3 }
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry',
    state: 'Puducherry',
    aqi: 61,
    waterQuality: 'Good',
    coordinates: { lat: 11.9416, lng: 79.8083 },
    population: 650000,
    riskFactors: { airPollution: 2, waterContamination: 3, industrialActivity: 3 }
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    aqi: 87,
    waterQuality: 'Good',
    coordinates: { lat: 30.3165, lng: 78.0322 },
    population: 800000,
    riskFactors: { airPollution: 3, waterContamination: 2, industrialActivity: 4 }
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    aqi: 39,
    waterQuality: 'Good',
    coordinates: { lat: 25.5788, lng: 91.8933 },
    population: 145000,
    riskFactors: { airPollution: 1, waterContamination: 2, industrialActivity: 2 }
  },
  {
    id: 'aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    aqi: 33,
    waterQuality: 'Good',
    coordinates: { lat: 23.7307, lng: 92.7173 },
    population: 295000,
    riskFactors: { airPollution: 1, waterContamination: 2, industrialActivity: 1 }
  },
  {
    id: 'imphal',
    name: 'Imphal',
    state: 'Manipur',
    aqi: 44,
    waterQuality: 'Good',
    coordinates: { lat: 24.8170, lng: 93.9368 },
    population: 270000,
    riskFactors: { airPollution: 2, waterContamination: 2, industrialActivity: 2 }
  },
  {
    id: 'panaji',
    name: 'Panaji',
    state: 'Goa',
    aqi: 47,
    waterQuality: 'Good',
    coordinates: { lat: 15.4909, lng: 73.8278 },
    population: 115000,
    riskFactors: { airPollution: 2, waterContamination: 2, industrialActivity: 3 }
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    aqi: 65,
    waterQuality: 'Good',
    coordinates: { lat: 34.0837, lng: 74.7973 },
    population: 1250000,
    riskFactors: { airPollution: 2, waterContamination: 3, industrialActivity: 3 }
  }
];

export const getAQILevel = (aqi: number): { level: string; color: string; description: string } => {
  if (aqi <= 50) return { 
    level: 'Good', 
    color: 'text-green-600 bg-green-50 border-green-200', 
    description: 'Air quality is satisfactory' 
  };
  if (aqi <= 100) return { 
    level: 'Moderate', 
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
    description: 'Air quality is acceptable for most people' 
  };
  if (aqi <= 150) return { 
    level: 'Unhealthy for Sensitive Groups', 
    color: 'text-orange-600 bg-orange-50 border-orange-200', 
    description: 'Members of sensitive groups may experience health effects' 
  };
  if (aqi <= 200) return { 
    level: 'Unhealthy', 
    color: 'text-red-600 bg-red-50 border-red-200', 
    description: 'Everyone may begin to experience health effects' 
  };
  if (aqi <= 300) return { 
    level: 'Very Unhealthy', 
    color: 'text-purple-600 bg-purple-50 border-purple-200', 
    description: 'Health warnings of emergency conditions' 
  };
  return { 
    level: 'Hazardous', 
    color: 'text-red-800 bg-red-100 border-red-300', 
    description: 'Health alert: everyone may experience serious health effects' 
  };
};

export const getWaterQualityColor = (quality: string): string => {
  switch (quality) {
    case 'Good': return 'text-green-600 bg-green-50 border-green-200';
    case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Poor': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Very Poor': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const calculateRiskScore = (city: CityData): number => {
  const aqiScore = Math.min(city.aqi / 50, 10); // Normalize AQI to 10-point scale
  const waterScore = city.waterQuality === 'Good' ? 2 : 
                     city.waterQuality === 'Moderate' ? 5 : 
                     city.waterQuality === 'Poor' ? 8 : 10;
  
  const { airPollution, waterContamination, industrialActivity } = city.riskFactors;
  
  return Math.round((aqiScore + waterScore + airPollution + waterContamination + industrialActivity) / 5 * 10) / 10;
};