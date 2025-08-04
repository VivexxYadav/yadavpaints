import React, { useState } from 'react';
import { Calendar, MapPin, Cloud, Sparkles, TrendingUp } from 'lucide-react';
import { PredictionInput, PredictionResult } from '../types';
import { predictSales } from '../utils/predictions';

interface PredictionFormProps {
  onPredict: (result: PredictionResult) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState<PredictionInput>({
    month: 'January',
    year: 2025,
    paintType: 'Interior Emulsion',
    areaType: 'Urban',
    weather: 'Sunny',
    season: 'Normal'
  });

  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const paintTypes = ['Primer', 'Interior Emulsion', 'Exterior Emulsion', 'Distemper'];
  const areaTypes = ['Urban', 'Rural'];
  const weatherTypes = ['Cold', 'Sunny', 'Hot', 'Rainy', 'Humid'];
  const seasonTypes = ['Normal', 'Festive', 'Wedding'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = predictSales(formData);
    onPredict(result);
    setLoading(false);
  };

  const handleInputChange = (field: keyof PredictionInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sales Prediction</h2>
          <p className="text-gray-600">Predict paint sales for any month</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Month and Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Month
            </label>
            <select
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className="input-field"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              min="2025"
              max="2030"
              className="input-field"
            />
          </div>
        </div>

        {/* Paint Type and Area Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sparkles className="inline w-4 h-4 mr-1" />
              Paint Type
            </label>
            <select
              value={formData.paintType}
              onChange={(e) => handleInputChange('paintType', e.target.value)}
              className="input-field"
            >
              {paintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Area Type
            </label>
            <select
              value={formData.areaType}
              onChange={(e) => handleInputChange('areaType', e.target.value)}
              className="input-field"
            >
              {areaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weather and Season */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Cloud className="inline w-4 h-4 mr-1" />
              Weather
            </label>
            <select
              value={formData.weather}
              onChange={(e) => handleInputChange('weather', e.target.value)}
              className="input-field"
            >
              {weatherTypes.map(weather => (
                <option key={weather} value={weather}>{weather}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season
            </label>
            <select
              value={formData.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              className="input-field"
            >
              {seasonTypes.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>Predict Sales</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};