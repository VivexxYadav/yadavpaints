import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { InventoryItem } from '../types';

export const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    paintType: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'Litres'
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        paintType: 'Interior Emulsion',
        currentStock: 850,
        minStock: 500,
        maxStock: 1500,
        unit: 'Litres',
        lastUpdated: new Date(),
        status: 'high'
      },
      {
        id: '2',
        paintType: 'Exterior Emulsion',
        currentStock: 320,
        minStock: 400,
        maxStock: 1200,
        unit: 'Litres',
        lastUpdated: new Date(),
        status: 'low'
      },
      {
        id: '3',
        paintType: 'Primer',
        currentStock: 600,
        minStock: 300,
        maxStock: 1000,
        unit: 'Litres',
        lastUpdated: new Date(),
        status: 'medium'
      },
      {
        id: '4',
        paintType: 'Distemper',
        currentStock: 150,
        minStock: 200,
        maxStock: 800,
        unit: 'Litres',
        lastUpdated: new Date(),
        status: 'low'
      }
    ];
    setInventory(sampleInventory);
  }, []);

  const getStatus = (item: InventoryItem): 'low' | 'medium' | 'high' => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'medium';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'high':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.paintType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      paintType: formData.paintType,
      currentStock: formData.currentStock,
      minStock: formData.minStock,
      maxStock: formData.maxStock,
      unit: formData.unit,
      lastUpdated: new Date(),
      status: getStatus({
        ...formData,
        id: '',
        lastUpdated: new Date(),
        status: 'medium'
      })
    };

    if (editingItem) {
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setInventory(prev => [...prev, newItem]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      paintType: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'Litres'
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      paintType: item.paintType,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const lowStockItems = inventory.filter(item => item.status === 'low');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <p className="text-red-700 mb-3">
            {lowStockItems.length} item(s) are running low on stock:
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {item.paintType}: {item.currentStock} {item.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paint Type
                </label>
                <input
                  type="text"
                  value={formData.paintType}
                  onChange={(e) => setFormData(prev => ({ ...prev, paintType: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="input-field"
                >
                  <option value="Litres">Litres</option>
                  <option value="Gallons">Gallons</option>
                  <option value="Cans">Cans</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Stock
                </label>
                <input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Paint Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Min/Max</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Updated</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.paintType}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{item.currentStock}</span> {item.unit}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.minStock} - {item.maxStock} {item.unit}
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.lastUpdated.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No inventory items found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};