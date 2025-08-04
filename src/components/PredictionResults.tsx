import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { PredictionResult } from '../types';

interface PredictionResultsProps {
  result: PredictionResult;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ result }) => {
  const getTrendIcon = () => {
    switch (result.trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (result.trend) {
      case 'increasing':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'decreasing':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = () => {
    if (result.confidence >= 80) return 'text-green-600 bg-green-50';
    if (result.confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Main Prediction */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Predicted Sales</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {result.predictedQuantity.toLocaleString()} L
          </div>
          <p className="text-gray-600">Expected paint sales volume</p>
        </div>
      </div>

      {/* Confidence and Trend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Confidence Level</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor()}`}>
              {result.confidence}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Market Trend</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getTrendColor()}`}>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className="capitalize">{result.trend}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Based on recent sales patterns
          </p>
        </div>
      </div>

      {/* Historical Comparison */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h4 className="font-semibold text-gray-800">Historical Comparison</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Historical Average</p>
            <p className="text-xl font-bold text-gray-800">{result.historicalAverage.toLocaleString()} L</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Seasonal Factor</p>
            <p className="text-xl font-bold text-blue-600">{result.seasonalFactor}x</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-gray-800">Smart Recommendations</h4>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};