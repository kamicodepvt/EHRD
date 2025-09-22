import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bot, Activity, ShoppingCart, Phone, FileText } from "lucide-react";

interface Question {
  id: string;
  type: 'radio' | 'input' | 'textarea' | 'multiselect';
  question: string;
  options?: string[];
  placeholder?: string;
}

interface UserResponse {
  questionId: string;
  answer: string | string[];
}

interface LocationVisit {
  city: string;
  duration: string;
  frequency: string;
}

interface ExposureActivity {
  id: string;
  date: string;
  location: string;
  exposureType: 'air' | 'water' | 'combined';
  duration: number; // in hours
  aqi?: number;
  waterQuality?: string;
  symptoms?: string[];
  notes?: string;
}

interface UserProfile {
  id: string;
  name?: string;
  ageGroup: string;
  healthConditions: string[];
  vulnerabilityLevel: 'low' | 'moderate' | 'high' | 'critical';
  createdAt: string;
  lastUpdated: string;
}

interface EquipmentRecommendation {
  category: 'masks' | 'airPurifiers' | 'waterFilters' | 'monitoring' | 'emergency';
  name: string;
  description: string;
  priority: 'essential' | 'recommended' | 'optional';
  priceRange: string;
  where: string;
}

interface ProfessionalContact {
  type: 'emergency' | 'specialist' | 'general' | 'telehealth';
  title: string;
  description: string;
  contact: string;
  when: string;
}

const questions: Question[] = [
  {
    id: 'age_group',
    type: 'radio',
    question: "What's your age group?",
    options: ['Under 18', '18-35', '36-50', '51-65', 'Over 65']
  },
  {
    id: 'health_conditions',
    type: 'radio',
    question: "Do you have any of these pre-existing health conditions?",
    options: [
      'None - I\'m generally healthy',
      'Respiratory conditions (Asthma, COPD, bronchitis)',
      'Heart disease or cardiovascular conditions', 
      'Diabetes or metabolic disorders',
      'Immune system disorders',
      'Multiple conditions from above'
    ]
  },
  {
    id: 'pregnancy_status',
    type: 'radio',
    question: "Are you currently pregnant or breastfeeding?",
    options: ['No', 'Yes, pregnant', 'Yes, breastfeeding', 'Prefer not to answer']
  },
  {
    id: 'smoking_status',
    type: 'radio',
    question: "What's your smoking status?",
    options: ['Never smoked', 'Former smoker', 'Current smoker', 'Exposed to secondhand smoke regularly']
  },
  {
    id: 'location_exposure',
    type: 'textarea',
    question: "Please describe your recent location history and exposure patterns. Include cities you've visited or lived in, duration of stay, and frequency of visits.",
    placeholder: "e.g., I live in Delhi for 2 years, visit Mumbai monthly for work (2-3 days each), traveled to Shimla last month for a week..."
  }
];

export function AIHealthAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');
  const [showChat, setShowChat] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [exposureHistory, setExposureHistory] = useState<ExposureActivity[]>([]);
  const [equipmentRecommendations, setEquipmentRecommendations] = useState<EquipmentRecommendation[]>([]);
  const [professionalContacts, setProfessionalContacts] = useState<ProfessionalContact[]>([]);
  const [showPersonalDashboard, setShowPersonalDashboard] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedProfile = localStorage.getItem('healthProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
          setShowPersonalDashboard(true);
        }
        
        const savedExposure = localStorage.getItem('exposureHistory');
        if (savedExposure) {
          setExposureHistory(JSON.parse(savedExposure));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const saveUserProfile = (profile: UserProfile) => {
    try {
      localStorage.setItem('healthProfile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const saveExposureActivity = (activity: ExposureActivity) => {
    try {
      const updatedHistory = [...exposureHistory, activity];
      localStorage.setItem('exposureHistory', JSON.stringify(updatedHistory));
      setExposureHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving exposure activity:', error);
    }
  };

  const handleAnswer = (answer: string | string[]) => {
    const newResponse: UserResponse = {
      questionId: currentQuestion.id,
      answer: answer
    };

    const updatedResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      newResponse
    ];
    setResponses(updatedResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateReport(updatedResponses);
    }
  };

  const generateReport = (userResponses: UserResponse[]) => {
    const ageGroup = userResponses.find(r => r.questionId === 'age_group')?.answer as string;
    const healthConditions = userResponses.find(r => r.questionId === 'health_conditions')?.answer as string;
    const pregnancyStatus = userResponses.find(r => r.questionId === 'pregnancy_status')?.answer as string;
    const smokingStatus = userResponses.find(r => r.questionId === 'smoking_status')?.answer as string;
    const locationExposure = userResponses.find(r => r.questionId === 'location_exposure')?.answer as string;

    // Determine vulnerability level
    let vulnerabilityScore = 0;
    let vulnerabilityFactors: string[] = [];
    let healthConditionsList: string[] = [];
    
    // Age factors
    if (ageGroup === 'Under 18' || ageGroup === 'Over 65') {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Age group (higher risk)');
    } else if (ageGroup === '51-65') {
      vulnerabilityScore += 1;
      vulnerabilityFactors.push('Age group (moderate risk)');
    }

    // Health condition factors
    if (healthConditions?.includes('Multiple conditions')) {
      vulnerabilityScore += 3;
      vulnerabilityFactors.push('Multiple pre-existing conditions');
      healthConditionsList = ['respiratory', 'cardiovascular', 'diabetes', 'immune'];
    } else if (healthConditions?.includes('Respiratory conditions')) {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Respiratory conditions');
      healthConditionsList = ['respiratory'];
    } else if (healthConditions?.includes('Heart disease')) {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Cardiovascular conditions');
      healthConditionsList = ['cardiovascular'];
    } else if (healthConditions?.includes('Diabetes')) {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Diabetes');
      healthConditionsList = ['diabetes'];
    } else if (healthConditions?.includes('Immune system')) {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Immune system disorders');
      healthConditionsList = ['immune'];
    }

    // Pregnancy factors
    if (pregnancyStatus?.includes('pregnant') || pregnancyStatus?.includes('breastfeeding')) {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Pregnancy/breastfeeding status');
    }

    // Smoking factors
    if (smokingStatus === 'Current smoker') {
      vulnerabilityScore += 2;
      vulnerabilityFactors.push('Current smoking');
    } else if (smokingStatus === 'Former smoker' || smokingStatus?.includes('secondhand')) {
      vulnerabilityScore += 1;
      vulnerabilityFactors.push('Smoking exposure');
    }

    // Analyze location exposure
    const exposureAnalysis = analyzeLocationExposure(locationExposure);
    vulnerabilityScore += exposureAnalysis.riskScore;
    if (exposureAnalysis.riskFactors.length > 0) {
      vulnerabilityFactors.push(...exposureAnalysis.riskFactors);
    }

    // Determine final risk level
    let finalRiskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (vulnerabilityScore >= 7) finalRiskLevel = 'critical';
    else if (vulnerabilityScore >= 5) finalRiskLevel = 'high';
    else if (vulnerabilityScore >= 3) finalRiskLevel = 'moderate';

    setRiskLevel(finalRiskLevel);

    // Create and save user profile
    const profile: UserProfile = {
      id: Date.now().toString(),
      ageGroup,
      healthConditions: healthConditionsList,
      vulnerabilityLevel: finalRiskLevel,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    saveUserProfile(profile);

    // Generate equipment recommendations
    const equipment = generateEquipmentRecommendations(finalRiskLevel, healthConditionsList);
    setEquipmentRecommendations(equipment);

    // Generate professional contacts
    const contacts = generateProfessionalContacts(finalRiskLevel, healthConditionsList);
    setProfessionalContacts(contacts);

    // Generate detailed report
    const reportContent = generateDetailedReport(
      ageGroup, healthConditions, pregnancyStatus, smokingStatus, 
      locationExposure, vulnerabilityFactors, finalRiskLevel, exposureAnalysis
    );
    
    setReport(reportContent);
    setIsComplete(true);
    setShowPersonalDashboard(true);
  };

  const analyzeLocationExposure = (exposure: string) => {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Check for high-risk cities mentioned
    const highRiskCities = ['Delhi', 'Kanpur', 'Lucknow', 'Kolkata', 'Ahmedabad'];
    const mentionedHighRiskCities = highRiskCities.filter(city => 
      exposure.toLowerCase().includes(city.toLowerCase())
    );

    if (mentionedHighRiskCities.length > 0) {
      riskScore += mentionedHighRiskCities.length;
      riskFactors.push(`High-risk location exposure: ${mentionedHighRiskCities.join(', ')}`);
    }

    // Check for duration indicators
    if (exposure.toLowerCase().includes('years') || exposure.toLowerCase().includes('live')) {
      riskScore += 2;
      riskFactors.push('Long-term exposure (years)');
    } else if (exposure.toLowerCase().includes('months')) {
      riskScore += 1;
      riskFactors.push('Medium-term exposure (months)');
    }

    // Check for frequency indicators
    if (exposure.toLowerCase().includes('daily') || exposure.toLowerCase().includes('regularly')) {
      riskScore += 2;
      riskFactors.push('Daily/regular exposure');
    } else if (exposure.toLowerCase().includes('weekly') || exposure.toLowerCase().includes('monthly')) {
      riskScore += 1;
      riskFactors.push('Frequent exposure (weekly/monthly)');
    }

    return { riskScore, riskFactors };
  };

  const generateDetailedReport = (
    ageGroup: string, healthConditions: string, pregnancyStatus: string, 
    smokingStatus: string, locationExposure: string, vulnerabilityFactors: string[], 
    riskLevel: string, exposureAnalysis: any
  ) => {
    const riskLevelInfo = {
      low: { color: 'text-green-700', bgColor: 'bg-green-50', icon: '🟢' },
      moderate: { color: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: '🟡' },
      high: { color: 'text-orange-700', bgColor: 'bg-orange-50', icon: '🟠' },
      critical: { color: 'text-red-700', bgColor: 'bg-red-50', icon: '🔴' }
    };

    // Analyze user's exposure history for personalized insights
    const exposureInsights = analyzeUserExposureHistory();
    const locationSpecificRisks = analyzeLocationSpecificRisks(locationExposure);
    const personalizedEquipment = getPersonalizedEquipmentPriority(riskLevel, exposureHistory);

    return `
## Personal Health Risk Assessment Report

### Overall Risk Level: **${riskLevel.toUpperCase()}** ${riskLevelInfo[riskLevel as keyof typeof riskLevelInfo].icon}

Based on your comprehensive health profile and tracked exposure data, you are classified as a **${vulnerabilityFactors.length > 2 ? 'VULNERABLE' : 'HEALTHY'}** individual with **${riskLevel.toUpperCase()}** environmental health risk.

### Your Personal Risk Profile:
${vulnerabilityFactors.length > 0 ? vulnerabilityFactors.map(factor => `• ${factor}`).join('\n') : '• No significant risk factors identified'}

### Exposure History Analysis:
${exposureInsights}

### Location-Specific Risk Assessment:
${locationSpecificRisks}

**Your Health Profile:**
- Age Category: **${ageGroup}** ${getAgeRiskNote(ageGroup)}
- Health Conditions: **${healthConditions}** ${getHealthConditionNote(healthConditions)}
- Additional Factors: ${pregnancyStatus}, ${smokingStatus}

### Data-Driven Recommendations Based on Your Profile:

${generatePersonalizedRecommendations(riskLevel, exposureHistory, vulnerabilityFactors)}

### Your Prioritized Equipment Needs:
${personalizedEquipment}

### Personalized Monitoring Schedule:
${getPersonalizedMonitoringSchedule(riskLevel, vulnerabilityFactors, exposureHistory)}

### When YOU Should Seek Medical Help:
${getPersonalizedMedicalGuidance(vulnerabilityFactors, riskLevel)}

### Next Steps for Your Profile:
${getPersonalizedNextSteps(riskLevel, exposureHistory, vulnerabilityFactors)}

*This assessment is based on your specific health profile and tracked exposure data. Always consult healthcare professionals for personalized medical advice.*
    `;
  };

  const analyzeUserExposureHistory = () => {
    if (exposureHistory.length === 0) {
      return "• No exposure activities tracked yet - Start logging your environmental exposure for personalized insights\n• Your recommendations are currently based on your health profile assessment";
    }

    const totalExposures = exposureHistory.length;
    const recentExposures = exposureHistory.filter(exp => {
      const expDate = new Date(exp.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return expDate >= thirtyDaysAgo;
    });

    const highRiskExposures = exposureHistory.filter(exp => (exp.aqi || 0) > 150);
    const avgDuration = exposureHistory.reduce((sum, exp) => sum + exp.duration, 0) / totalExposures;
    
    const mostVisitedLocation = exposureHistory.reduce((acc, exp) => {
      acc[exp.location] = (acc[exp.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topLocation = Object.entries(mostVisitedLocation).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Various locations';

    return `• **${totalExposures} exposure activities** tracked in your personal database
• **${recentExposures.length} recent exposures** in the last 30 days
• **${highRiskExposures.length} high-risk exposures** (AQI > 150) recorded
• **Average exposure duration**: ${avgDuration.toFixed(1)} hours per activity
• **Most frequent location**: ${topLocation}
• **Risk pattern**: ${recentExposures.length > 5 ? 'High frequency exposure pattern detected' : 'Moderate exposure frequency'}`;
  };

  const analyzeLocationSpecificRisks = (locationExposure: string) => {
    const highRiskCities = ['Delhi', 'Kanpur', 'Lucknow', 'Kolkata', 'Ahmedabad', 'Patna', 'Agra'];
    const mentionedRiskyCities = highRiskCities.filter(city => 
      locationExposure.toLowerCase().includes(city.toLowerCase())
    );

    if (mentionedRiskyCities.length === 0) {
      return "• Based on your location history, you primarily visit areas with moderate environmental conditions\n• Continue monitoring for any changes in air/water quality in your areas";
    }

    return `• **HIGH ALERT**: You have significant exposure to **${mentionedRiskyCities.join(', ')}** - among India's most polluted cities
• **Critical concern**: These locations have AQI levels frequently exceeding 200-400
• **Water quality risk**: Industrial contamination documented in these areas
• **Immediate action needed**: Your exposure to these locations significantly elevates your risk profile`;
  };

  const getPersonalizedEquipmentPriority = (riskLevel: string, exposureHistory: ExposureActivity[]) => {
    const highRiskExposures = exposureHistory.filter(exp => (exp.aqi || 0) > 150).length;
    const frequentExposure = exposureHistory.length > 5;

    if (riskLevel === 'critical' || highRiskExposures > 3) {
      return `**CRITICAL PRIORITY:**
1. **N99 Respirator Masks** - Essential for your exposure pattern (₹100-200 each)
2. **HEPA Air Purifier** - Mandatory for indoor protection (₹20,000-60,000)
3. **Personal AQI Monitor** - Track real-time exposure (₹3,000-10,000)
4. **Emergency Inhaler** - Keep readily available (Consult doctor)`;
    }

    if (riskLevel === 'high' || frequentExposure) {
      return `**HIGH PRIORITY:**
1. **N95 Masks** - For outdoor protection (₹50-150 each)
2. **Air Purifier** - For your most-used room (₹8,000-25,000)
3. **Water Purifier Upgrade** - Enhanced filtration needed (₹10,000-30,000)`;
    }

    return `**RECOMMENDED:**
1. **KN95 Masks** - For moderate protection (₹30-80 each)
2. **Basic Air Purifier** - For improved indoor air (₹5,000-15,000)
3. **UV Water Purifier** - Standard protection (₹4,000-12,000)`;
  };

  const generatePersonalizedRecommendations = (riskLevel: string, exposureHistory: ExposureActivity[], vulnerabilityFactors: string[]) => {
    const hasRespiratoryConditions = vulnerabilityFactors.some(factor => factor.toLowerCase().includes('respiratory'));
    const hasHighExposure = exposureHistory.filter(exp => (exp.aqi || 0) > 150).length > 2;
    const hasFrequentExposure = exposureHistory.length > 10;

    if (riskLevel === 'critical') {
      return `**🚨 CRITICAL RISK - Immediate Action Required:**
- **URGENT**: Minimize outdoor exposure in high-pollution areas immediately
- **Your data shows**: ${hasHighExposure ? 'Multiple high-risk exposures detected' : 'Elevated risk due to health profile'}
- **Daily protocol**: N99 mask mandatory, check AQI before leaving home
- **Indoor safety**: HEPA purification essential in your living/work spaces
- **Medical monitoring**: ${hasRespiratoryConditions ? 'Weekly respiratory check-ups due to your conditions' : 'Bi-weekly health monitoring'}
- **Emergency plan**: Keep rescue medications accessible, emergency contacts updated`;
    }

    if (riskLevel === 'high') {
      return `**⚠️ HIGH RISK - Enhanced Precautions Needed:**
- **Your exposure pattern**: ${hasFrequentExposure ? 'Frequent exposure activities require enhanced protection' : 'Moderate activity with elevated health risks'}
- **Daily protection**: N95 masks for AQI > 100, limit outdoor time during peak pollution
- **Indoor environment**: Air purification recommended for spaces where you spend >4 hours
- **Health monitoring**: ${hasRespiratoryConditions ? 'Monthly specialist visits' : 'Monthly general health check-ups'}
- **Activity modification**: Avoid outdoor exercise when AQI > 150`;
    }

    if (riskLevel === 'moderate') {
      return `**🟡 MODERATE RISK - Targeted Precautions:**
- **Based on your profile**: Standard precautions with enhanced monitoring
- **Protection strategy**: Masks when AQI > 150, quality water filtration
- **Activity guidance**: Monitor daily AQI, adjust outdoor plans accordingly
- **Health schedule**: Quarterly check-ups, annual comprehensive health screening`;
    }

    return `**🟢 LOW RISK - Preventive Measures:**
- **Your current status**: Good health profile with minimal exposure risks
- **Maintenance plan**: Continue current health practices, basic environmental awareness
- **Monitoring**: Annual health check-ups, stay informed about local environmental conditions
- **Prevention focus**: Maintain protective habits during high-pollution events`;
  };

  const getPersonalizedMonitoringSchedule = (riskLevel: string, vulnerabilityFactors: string[], exposureHistory: ExposureActivity[]) => {
    const hasHealthConditions = vulnerabilityFactors.length > 2;
    const hasRecentHighExposure = exposureHistory.some(exp => {
      const expDate = new Date(exp.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return expDate >= sevenDaysAgo && (exp.aqi || 0) > 150;
    });

    if (riskLevel === 'critical') {
      return `**Your Personal Monitoring Plan:**
- **Daily**: Health symptom tracking, AQI monitoring before outdoor activities
- **Weekly**: Weight, blood pressure, respiratory function assessment
- **Bi-weekly**: Medical professional consultation
- **Monthly**: Comprehensive health evaluation, medication review`;
    }

    if (riskLevel === 'high') {
      return `**Your Personal Monitoring Plan:**
- **Daily**: Basic symptom awareness, environmental condition checking
- **Weekly**: ${hasHealthConditions ? 'Condition-specific monitoring' : 'General health observation'}
- **Monthly**: Medical check-up, review of exposure patterns
- **Quarterly**: Comprehensive health assessment`;
    }

    return `**Your Personal Monitoring Plan:**
- **Weekly**: General health awareness, environmental updates
- **Monthly**: Basic health check, review exposure tracking data
- **Quarterly**: Medical consultation, comprehensive assessment
- **Annually**: Full health screening, update risk assessment`;
  };

  const getPersonalizedMedicalGuidance = (vulnerabilityFactors: string[], riskLevel: string) => {
    const hasRespiratory = vulnerabilityFactors.some(f => f.toLowerCase().includes('respiratory'));
    const hasCardiovascular = vulnerabilityFactors.some(f => f.toLowerCase().includes('cardiovascular'));
    const hasDiabetes = vulnerabilityFactors.some(f => f.toLowerCase().includes('diabetes'));

    let guidance = `**Seek immediate medical attention if you experience:**\n`;
    
    if (hasRespiratory || riskLevel === 'critical') {
      guidance += `- Persistent cough lasting >3 days (your respiratory condition increases urgency)\n`;
      guidance += `- Shortness of breath during normal activities\n`;
      guidance += `- Wheezing or chest tightness that doesn't respond to usual medications\n`;
    }

    if (hasCardiovascular) {
      guidance += `- Chest pain or pressure (elevated risk due to your cardiovascular condition)\n`;
      guidance += `- Irregular heartbeat or palpitations\n`;
      guidance += `- Unusual fatigue or dizziness\n`;
    }

    if (hasDiabetes) {
      guidance += `- Unexplained blood sugar fluctuations\n`;
      guidance += `- Unusual thirst or frequent urination changes\n`;
    }

    guidance += `- Multiple symptoms appearing together\n`;
    guidance += `- Any symptom that worsens despite following your protection protocol\n`;
    guidance += `- Skin reactions or rashes that persist >48 hours\n`;

    return guidance;
  };

  const getPersonalizedNextSteps = (riskLevel: string, exposureHistory: ExposureActivity[], vulnerabilityFactors: string[]) => {
    let steps = `**Immediate Actions (Next 7 Days):**\n`;
    
    if (exposureHistory.length < 5) {
      steps += `- Start logging your daily exposure activities for better tracking\n`;
    }
    
    if (riskLevel === 'critical' || riskLevel === 'high') {
      steps += `- Purchase essential protective equipment identified above\n`;
      steps += `- Schedule medical consultation within 1-2 weeks\n`;
      steps += `- Set up daily AQI monitoring alerts for your area\n`;
    }

    steps += `\n**Medium-term Goals (Next 30 Days):**\n`;
    steps += `- Build comprehensive exposure tracking habits\n`;
    steps += `- Establish relationship with appropriate healthcare specialists\n`;
    steps += `- Implement recommended protection protocols consistently\n`;

    if (exposureHistory.filter(exp => (exp.aqi || 0) > 150).length > 3) {
      steps += `- Consider lifestyle modifications to reduce high-risk exposure\n`;
    }

    steps += `\n**Long-term Strategy (3-6 Months):**\n`;
    steps += `- Review and optimize your environmental health management plan\n`;
    steps += `- Assess effectiveness of implemented protective measures\n`;
    steps += `- Update health risk assessment based on tracked data trends\n`;

    return steps;
  };

  const getAgeRiskNote = (ageGroup: string) => {
    if (ageGroup === 'Under 18' || ageGroup === 'Over 65') return '(Higher vulnerability group)';
    if (ageGroup === '51-65') return '(Moderate risk category)';
    return '(Standard risk category)';
  };

  const getHealthConditionNote = (healthConditions: string) => {
    if (healthConditions.includes('Multiple conditions')) return '(Significantly elevated risk)';
    if (healthConditions.includes('Respiratory') || healthConditions.includes('Heart disease')) return '(Elevated risk)';
    if (healthConditions.includes('None')) return '(No additional risk factors)';
    return '(Some risk factors present)';
  };

  const generateEquipmentRecommendations = (riskLevel: string, healthConditions: string[]): EquipmentRecommendation[] => {
    const recommendations: EquipmentRecommendation[] = [];

    // Essential mask recommendation
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push({
        category: 'masks',
        name: 'N95/N99 Respirator Masks',
        description: 'Professional-grade masks that filter 95-99% of airborne particles',
        priority: 'essential',
        priceRange: '₹50-150 per mask',
        where: 'Medical stores, Amazon, Flipkart'
      });
    }

    // Air purifier recommendation
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push({
        category: 'airPurifiers',
        name: 'HEPA Air Purifier',
        description: 'Removes particles and improves indoor air quality',
        priority: 'essential',
        priceRange: '₹15,000-50,000',
        where: 'Croma, Amazon, local electronics stores'
      });
    }

    // Water filter recommendation
    recommendations.push({
      category: 'waterFilters',
      name: 'RO + UV Water Purifier',
      description: 'Comprehensive water purification system',
      priority: riskLevel === 'critical' || riskLevel === 'high' ? 'essential' : 'recommended',
      priceRange: '₹8,000-25,000',
      where: 'Aquaguard, Kent, local dealers'
    });

    return recommendations;
  };

  const generateProfessionalContacts = (riskLevel: string, healthConditions: string[]): ProfessionalContact[] => {
    const contacts: ProfessionalContact[] = [];

    // Emergency Services
    contacts.push({
      type: 'emergency',
      title: 'Emergency Medical Services',
      description: 'For immediate life-threatening situations',
      contact: '108 (National Emergency Number)',
      when: 'Severe breathing difficulty, chest pain, loss of consciousness'
    });

    // General Practitioner
    contacts.push({
      type: 'general',
      title: 'General Practitioner (GP)',
      description: 'Primary care physician for regular monitoring',
      contact: 'Local clinics, family doctors',
      when: 'Regular check-ups, mild symptoms, health advice'
    });

    // Telehealth Options
    contacts.push({
      type: 'telehealth',
      title: 'Telehealth Consultation',
      description: 'Online medical consultation for non-emergency issues',
      contact: 'Practo, DocsApp, 1mg, Tata Health',
      when: 'Initial consultation, follow-ups, medication advice'
    });

    return contacts;
  };

  const restartAssessment = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsComplete(false);
    setReport('');
    setRiskLevel('low');
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const addExposureActivity = () => {
    const now = new Date();
    const activity: ExposureActivity = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      location: 'Current Location',
      exposureType: 'air',
      duration: 2,
      aqi: 150,
      symptoms: [],
      notes: ''
    };
    saveExposureActivity(activity);
  };

  const getTrendAnalysis = () => {
    if (exposureHistory.length < 2) return null;
    
    const recentActivities = exposureHistory.slice(-7);
    const avgDuration = recentActivities.reduce((sum, activity) => sum + activity.duration, 0) / recentActivities.length;
    const riskTrend = recentActivities.filter(a => (a.aqi || 0) > 150).length / recentActivities.length;
    
    return {
      avgDuration: Math.round(avgDuration * 10) / 10,
      riskTrend: Math.round(riskTrend * 100),
      totalExposures: exposureHistory.length
    };
  };

  if (showPersonalDashboard && userProfile) {
    const trendAnalysis = getTrendAnalysis();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Personal Health Dashboard
          </CardTitle>
          <CardDescription>
            Your personalized environmental health management system
          </CardDescription>
          <div className="flex items-center gap-2">
            <Badge className={getRiskBadgeColor(userProfile.vulnerabilityLevel)}>
              Risk Level: {userProfile.vulnerabilityLevel.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Profile Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">📊 Risk Status</h4>
                <p className="text-2xl font-bold text-blue-600">{userProfile.vulnerabilityLevel.toUpperCase()}</p>
                <p className="text-xs text-blue-700">Based on your health profile</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-2">📈 Trend Analysis</h4>
                {trendAnalysis ? (
                  <>
                    <p className="text-2xl font-bold text-purple-600">{trendAnalysis.riskTrend}%</p>
                    <p className="text-xs text-purple-700">High-risk exposures recently</p>
                  </>
                ) : (
                  <p className="text-sm text-purple-700">Start tracking to see trends</p>
                )}
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">🎯 Total Tracking</h4>
                <p className="text-2xl font-bold text-green-600">{exposureHistory.length}</p>
                <p className="text-xs text-green-700">Exposure activities logged</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚡ Quick Actions</h4>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={addExposureActivity} className="bg-blue-600 hover:bg-blue-700">
                  Log Current Exposure
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowChat(true)}>
                  Retake Assessment
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  localStorage.removeItem('healthProfile');
                  localStorage.removeItem('exposureHistory');
                  setUserProfile(null);
                  setShowPersonalDashboard(false);
                }}>
                  Reset Profile
                </Button>
              </div>
            </div>

            {/* Equipment Recommendations */}
            <div className="space-y-4">
              <h4 className="font-medium">🛡️ Top Equipment Recommendations</h4>
              {equipmentRecommendations.slice(0, 3).map((equipment, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  equipment.priority === 'essential' ? 'border-red-200 bg-red-50' :
                  equipment.priority === 'recommended' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">{equipment.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{equipment.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="font-medium">Price: {equipment.priceRange}</span>
                      </div>
                    </div>
                    <Badge className={
                      equipment.priority === 'essential' ? 'bg-red-100 text-red-800' :
                      equipment.priority === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {equipment.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showChat && !showPersonalDashboard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Health Risk Assessment
          </CardTitle>
          <CardDescription>
            Get a personalized health risk evaluation based on your profile and location exposure history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">🤖 Meet Your AI Health Assistant</h4>
              <p className="text-sm text-blue-700">
                I'll ask you a few questions about your health, lifestyle, and location history to provide 
                a personalized environmental health risk assessment and recommendations.
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-600">
                <span>• 5 quick questions</span>
                <span>• Equipment recommendations</span>
                <span>• Professional contacts</span>
                <span>• Exposure tracking</span>
              </div>
            </div>
            <Button onClick={() => setShowChat(true)} className="bg-blue-600 hover:bg-blue-700">
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Your Personal Health Risk Report
          </CardTitle>
          <CardDescription>
            AI-generated assessment based on your responses
          </CardDescription>
          <div className="flex items-center gap-2">
            <Badge className={getRiskBadgeColor(riskLevel)}>
              Risk Level: {riskLevel.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {responses.filter(r => r.questionId !== 'location_exposure').some(r => 
                r.answer.toString().includes('None') || r.answer.toString().includes('Never') || 
                r.answer.toString().includes('18-35') || r.answer.toString().includes('36-50')
              ) ? 'Healthy Individual' : 'Vulnerable Individual'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              {report.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-base font-semibold mt-3 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-semibold mt-2 mb-1">{line.substring(2, line.length - 2)}</p>;
                } else if (line.startsWith('• ')) {
                  return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
                } else if (line.trim()) {
                  return <p key={index} className="mb-2">{line}</p>;
                } else {
                  return <br key={index} />;
                }
              })}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={restartAssessment} variant="outline">
              Retake Assessment
            </Button>
            <Button onClick={() => setShowChat(false)} variant="outline">
              Back to Overview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Health Assessment
        </CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-3">{currentQuestion.question}</p>
              
              {currentQuestion.type === 'radio' && (
                <RadioGroup onValueChange={handleAnswer} className="space-y-2">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {currentQuestion.type === 'input' && (
                <div className="space-y-2">
                  <Input 
                    placeholder={currentQuestion.placeholder}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswer((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const input = document.querySelector('input') as HTMLInputElement;
                      if (input?.value) handleAnswer(input.value);
                    }}
                    size="sm"
                  >
                    Continue
                  </Button>
                </div>
              )}
              
              {currentQuestion.type === 'textarea' && (
                <div className="space-y-2">
                  <Textarea 
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className="resize-none"
                  />
                  <Button 
                    onClick={() => {
                      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                      if (textarea?.value) handleAnswer(textarea.value);
                    }}
                    size="sm"
                  >
                    Complete Assessment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowChat(false)}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}