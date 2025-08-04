import { PaintData, PredictionInput, PredictionResult } from '../types';
import { paintData } from '../data/paintData';

export const predictSales = (input: PredictionInput): PredictionResult => {
  // Filter historical data for similar conditions
  const similarData = paintData.filter(item => 
    item['Paint Type'] === input.paintType &&
    item['Area Type'] === input.areaType &&
    item.Weather === input.weather &&
    item.Season === input.season
  );

  // Calculate base prediction from similar conditions
  let basePrediction = 0;
  if (similarData.length > 0) {
    basePrediction = similarData.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0) / similarData.length;
  }

  // Get historical data for the same month across years
  const monthlyData = paintData.filter(item => 
    item.Month === input.month &&
    item['Paint Type'] === input.paintType &&
    item['Area Type'] === input.areaType
  );

  let monthlyAverage = 0;
  if (monthlyData.length > 0) {
    monthlyAverage = monthlyData.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0) / monthlyData.length;
  }

  // Calculate trend from recent years
  const recentData = paintData
    .filter(item => 
      item['Paint Type'] === input.paintType &&
      item['Area Type'] === input.areaType &&
      item.Year >= 2022
    )
    .sort((a, b) => a.Year - b.Year);

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentData.length >= 2) {
    const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
    const secondHalf = recentData.slice(Math.floor(recentData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    if (change > 0.05) trend = 'increasing';
    else if (change < -0.05) trend = 'decreasing';
  }

  // Apply seasonal and weather factors
  let seasonalFactor = 1;
  if (input.season === 'Festive') seasonalFactor = 1.3;
  else if (input.season === 'Wedding') seasonalFactor = 1.2;

  let weatherFactor = 1;
  if (input.weather === 'Rainy') weatherFactor = 0.8;
  else if (input.weather === 'Sunny') weatherFactor = 1.1;

  // Calculate final prediction
  const weightedPrediction = (basePrediction * 0.6 + monthlyAverage * 0.4) * seasonalFactor * weatherFactor;
  
  // Apply trend adjustment
  let trendFactor = 1;
  if (trend === 'increasing') trendFactor = 1.1;
  else if (trend === 'decreasing') trendFactor = 0.9;

  const finalPrediction = Math.round(weightedPrediction * trendFactor);

  // Calculate confidence based on data availability
  let confidence = 0.5;
  if (similarData.length > 5) confidence += 0.2;
  if (monthlyData.length > 3) confidence += 0.2;
  if (recentData.length > 10) confidence += 0.1;
  confidence = Math.min(confidence, 0.95);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (input.season === 'Festive' || input.season === 'Wedding') {
    recommendations.push('Stock up extra inventory for seasonal demand');
  }
  
  if (input.weather === 'Rainy') {
    recommendations.push('Focus on interior paints during rainy season');
  }
  
  if (trend === 'increasing') {
    recommendations.push('Consider increasing inventory by 10-15%');
  } else if (trend === 'decreasing') {
    recommendations.push('Monitor market conditions and adjust pricing');
  }

  if (input.areaType === 'Urban') {
    recommendations.push('Premium paint varieties perform better in urban areas');
  }

  return {
    predictedQuantity: finalPrediction,
    confidence: Math.round(confidence * 100),
    trend,
    recommendations,
    historicalAverage: Math.round(monthlyAverage || basePrediction),
    seasonalFactor: Math.round(seasonalFactor * 100) / 100
  };
};

export const getHistoricalData = (paintType?: string, areaType?: string) => {
  let data = paintData;
  
  if (paintType) {
    data = data.filter(item => item['Paint Type'] === paintType);
  }
  
  if (areaType) {
    data = data.filter(item => item['Area Type'] === areaType);
  }
  
  return data;
};

export const getSalesStats = () => {
  const totalSales = paintData.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0);
  const avgMonthlySales = totalSales / paintData.length;
  
  const paintTypes = [...new Set(paintData.map(item => item['Paint Type']))];
  const topPaintType = paintTypes.reduce((top, type) => {
    const typeTotal = paintData
      .filter(item => item['Paint Type'] === type)
      .reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0);
    
    const currentTopTotal = paintData
      .filter(item => item['Paint Type'] === top)
      .reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0);
    
    return typeTotal > currentTopTotal ? type : top;
  });

  return {
    totalSales: Math.round(totalSales),
    avgMonthlySales: Math.round(avgMonthlySales),
    topPaintType,
    totalRecords: paintData.length
  };
};