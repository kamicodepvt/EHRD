export interface HealthRisk {
  disease: string;
  exposureType: 'Poor AQI' | 'Contaminated Water' | 'Combined AQI + Water';
  durationToRisk: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  healthyRisk: string;
  vulnerableRisk: string;
}

export const healthRisksData: HealthRisk[] = [
  {
    disease: "Acute Respiratory Infection",
    exposureType: "Poor AQI",
    durationToRisk: "1–3 days",
    severity: "Moderate",
    healthyRisk: "3–5 days of continuous exposure",
    vulnerableRisk: "12–24 hours of exposure"
  },
  {
    disease: "Asthma Exacerbation",
    exposureType: "Poor AQI",
    durationToRisk: "Hours to 2 days",
    severity: "Severe",
    healthyRisk: "2–3 days in high AQI zones",
    vulnerableRisk: "4–6 hours in hazardous AQI"
  },
  {
    disease: "Chronic Bronchitis",
    exposureType: "Poor AQI",
    durationToRisk: "3+ months",
    severity: "Severe",
    healthyRisk: "90+ days of exposure",
    vulnerableRisk: "30–60 days of exposure"
  },
  {
    disease: "Lung Cancer",
    exposureType: "Poor AQI",
    durationToRisk: "Years",
    severity: "Critical",
    healthyRisk: "2–5 years of chronic exposure",
    vulnerableRisk: "1–3 years of chronic exposure"
  },
  {
    disease: "Cardiovascular Disease",
    exposureType: "Poor AQI",
    durationToRisk: "Weeks to years",
    severity: "Severe",
    healthyRisk: "6+ months of exposure",
    vulnerableRisk: "1–3 months of exposure"
  },
  {
    disease: "Skin Rashes/Infections",
    exposureType: "Contaminated Water",
    durationToRisk: "1–3 days",
    severity: "Mild",
    healthyRisk: "3–5 days of contact",
    vulnerableRisk: "1–2 days of contact"
  },
  {
    disease: "Diarrhea/Dysentery",
    exposureType: "Contaminated Water",
    durationToRisk: "1–3 days",
    severity: "Moderate",
    healthyRisk: "2–4 days of ingestion/contact",
    vulnerableRisk: "12–24 hours of ingestion/contact"
  },
  {
    disease: "Typhoid/Cholera",
    exposureType: "Contaminated Water",
    durationToRisk: "3–7 days",
    severity: "Severe",
    healthyRisk: "5–7 days of exposure",
    vulnerableRisk: "2–3 days of exposure"
  },
  {
    disease: "Arsenic/Lead Poisoning",
    exposureType: "Contaminated Water",
    durationToRisk: "Months to years",
    severity: "Critical",
    healthyRisk: "6–12 months of exposure",
    vulnerableRisk: "3–6 months of exposure"
  },
  {
    disease: "Neurological Disorders",
    exposureType: "Contaminated Water",
    durationToRisk: "Years",
    severity: "Critical",
    healthyRisk: "2–4 years of exposure",
    vulnerableRisk: "1–2 years of exposure"
  },
  {
    disease: "Multi-organ Stress",
    exposureType: "Combined AQI + Water",
    durationToRisk: "Weeks to months",
    severity: "Severe",
    healthyRisk: "30–60 days of dual exposure",
    vulnerableRisk: "7–14 days of dual exposure"
  },
  {
    disease: "Premature Mortality",
    exposureType: "Combined AQI + Water",
    durationToRisk: "Years",
    severity: "Critical",
    healthyRisk: "3–5 years of chronic exposure",
    vulnerableRisk: "1–2 years of chronic exposure"
  }
];

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Mild':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Severe':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getExposureTypeIcon = (type: string) => {
  if (type.includes('AQI')) return '🌫️';
  if (type.includes('Water')) return '💧';
  if (type.includes('Combined')) return '⚠️';
  return '🧬';
};