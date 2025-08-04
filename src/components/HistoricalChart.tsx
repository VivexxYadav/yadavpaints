import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Filter } from 'lucide-react';
import { getHistoricalData } from '../utils/predictions';

export const HistoricalChart: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [paintTypeFilter, setPaintTypeFilter] = useState<string>('');
  const [areaTypeFilter, setAreaTypeFilter] = useState<string>('');

  const rawData = getHistoricalData(paintTypeFilter || undefined, areaTypeFilter || undefined);

  const chartData = useMemo(() => {
    if (chartType === 'pie') {
      // Aggregate by paint type
      const paintTypeData = rawData.reduce((acc, item) => {
        const key = item['Paint Type'];
        acc[key] = (acc[key] || 0) + item['Quantity Sold (Litres)'];
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(paintTypeData).map(([name, value]) => ({
        name,
        value
      }));
    }

    // Group by month-year for line and bar charts
    const monthlyData = rawData.reduce((acc, item) => {
      const key = `${item.Month} ${item.Year}`;
      if (!acc[key]) {
        acc[key] = {
          period: key,
          month: item.Month,
          year: item.Year,
          total: 0,
          count: 0
        };
      }
      acc[key].total += item['Quantity Sold (Litres)'];
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData)
      .map(item => ({
        ...item,
        average: Math.round(item.total / item.count)
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      })
      .slice(-24); // Last 24 months
  }, [rawData, chartType]);

  const paintTypes = [...new Set(getHistoricalData().map(item => item['Paint Type']))];
  const areaTypes = [...new Set(getHistoricalData().map(item => item['Area Type']))];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  const chartTypeButtons = [
    { type: 'line' as const, icon: LineChartIcon, label: 'Line Chart' },
    { type: 'bar' as const, icon: BarChart3, label: 'Bar Chart' },
    { type: 'pie' as const, icon: PieChartIcon, label: 'Pie Chart' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Sales Analytics</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {chartTypeButtons.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    chartType === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={paintTypeFilter}
                onChange={(e) => setPaintTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
              >
                <option value="">All Paint Types</option>
                {paintTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={areaTypeFilter}
                onChange={(e) => setAreaTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
              >
                <option value="">All Areas</option>
                {areaTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} L`, 'Average Sales']}
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            )}

            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} L`, 'Average Sales']}
                />
                <Bar 
                  dataKey="average" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} L`, 'Total Sales']}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Records</h3>
          <p className="text-3xl font-bold text-blue-600">{rawData.length}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Volume</h3>
          <p className="text-3xl font-bold text-green-600">
            {rawData.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0).toLocaleString()} L
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average per Record</h3>
          <p className="text-3xl font-bold text-purple-600">
            {rawData.length > 0 
              ? Math.round(rawData.reduce((sum, item) => sum + item['Quantity Sold (Litres)'], 0) / rawData.length).toLocaleString()
              : 0
            } L
          </p>
        </div>
      </div>
    </div>
  );
};