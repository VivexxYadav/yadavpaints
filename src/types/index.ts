export interface User {
  id: string;
  email: string;
  name: string;
  shopName: string;
}

export interface PaintData {
  Month: string;
  Year: number;
  'Paint Type': string;
  'Area Type': string;
  'Quantity Sold (Litres)': number;
  Weather: string;
  Season: string;
}

export interface PredictionInput {
  month: string;
  year: number;
  paintType: string;
  areaType: string;
  weather: string;
  season: string;
}

export interface PredictionResult {
  predictedQuantity: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
  historicalAverage: number;
  seasonalFactor: number;
}

export interface InventoryItem {
  id: string;
  paintType: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastUpdated: Date;
  status: 'low' | 'medium' | 'high';
}