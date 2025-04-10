'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';

export default function ItemsManagement() {
  const { gameSession, addItem, updateItem, removeItem } = useGameContext();
  const [newItem, setNewItem] = React.useState({ name: '', basePrice: 0, description: '' });
  const [editingItem, setEditingItem] = React.useState<null | { id: string, name: string, basePrice: number, description: string }>(null);
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.basePrice > 0) {
      addItem({
        id: Math.random().toString(36).substring(2, 9),
        name: newItem.name,
        basePrice: newItem.basePrice,
        description: newItem.description
      });
      setNewItem({ name: '', basePrice: 0, description: '' });
    }
  };
  
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editingItem.name && editingItem.basePrice > 0) {
      updateItem(editingItem);
      setEditingItem(null);
    }
  };
  
  const handleRemoveItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeItem(id);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Items Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Add, edit, or remove items that can be traded in the game.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Add New Item</h4>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                name="basePrice"
                id="basePrice"
                min="0"
                step="0.01"
                value={newItem.basePrice}
                onChange={(e) => setNewItem({...newItem, basePrice: parseFloat(e.target.value)})}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
      
      {editingItem && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
          <h4 className="text-md font-medium text-gray-700 mb-4">Edit Item</h4>
          <form onSubmit={handleUpdateItem} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="edit-name"
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-basePrice" className="block text-sm font-medium text-gray-700">Base Price</label>
                <input
                  type="number"
                  name="edit-basePrice"
                  id="edit-basePrice"
                  min="0"
                  step="0.01"
                  value={editingItem.basePrice}
                  onChange={(e) => setEditingItem({...editingItem, basePrice: parseFloat(e.target.value)})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="edit-description"
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Current Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gameSession.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.basePrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingItem({
                        id: item.id,
                        name: item.name,
                        basePrice: item.basePrice,
                        description: item.description || ''
                      })}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {gameSession.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No items added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
