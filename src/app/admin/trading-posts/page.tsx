'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';

export default function TradingPostsManagement() {
  const { gameSession, addTradingPost, updateTradingPost, removeTradingPost, updateCurrency } = useGameContext();
  const [newPost, setNewPost] = React.useState({ name: '', description: '', currency: 0 });
  const [editingPost, setEditingPost] = React.useState<null | { id: string, name: string, description: string, currency: number }>(null);
  
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.name) {
      addTradingPost({
        id: Math.random().toString(36).substring(2, 9),
        name: newPost.name,
        description: newPost.description,
        isActive: false,
        inventory: {},
        currency: newPost.currency
      });
      setNewPost({ name: '', description: '', currency: 0 });
    }
  };
  
  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost && editingPost.name) {
      const post = gameSession.tradingPosts.find(p => p.id === editingPost.id);
      if (post) {
        updateTradingPost({
          ...post,
          name: editingPost.name,
          description: editingPost.description,
          currency: editingPost.currency
        });
      }
      setEditingPost(null);
    }
  };
  
  const handleRemovePost = (id: string) => {
    if (window.confirm('Are you sure you want to remove this trading post?')) {
      removeTradingPost(id);
    }
  };
  
  const handleCurrencyChange = (postId: string, amount: number) => {
    updateCurrency(postId, amount);
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Trading Posts Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Add, edit, or remove trading posts in the game.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Add New Trading Post</h4>
        <form onSubmit={handleAddPost} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={newPost.name}
                onChange={(e) => setNewPost({...newPost, name: e.target.value})}
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
                value={newPost.description}
                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Starting Currency</label>
              <input
                type="number"
                name="currency"
                id="currency"
                min="0"
                value={newPost.currency}
                onChange={(e) => setNewPost({...newPost, currency: parseInt(e.target.value)})}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Trading Post
            </button>
          </div>
        </form>
      </div>
      
      {editingPost && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
          <h4 className="text-md font-medium text-gray-700 mb-4">Edit Trading Post</h4>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="edit-name"
                  id="edit-name"
                  value={editingPost.name}
                  onChange={(e) => setEditingPost({...editingPost, name: e.target.value})}
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
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="edit-currency" className="block text-sm font-medium text-gray-700">Currency</label>
                <input
                  type="number"
                  name="edit-currency"
                  id="edit-currency"
                  min="0"
                  value={editingPost.currency}
                  onChange={(e) => setEditingPost({...editingPost, currency: parseInt(e.target.value)})}
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
                onClick={() => setEditingPost(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Current Trading Posts</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gameSession.tradingPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{post.currency}</span>
                      <button
                        onClick={() => handleCurrencyChange(post.id, post.currency + 10)}
                        className="text-xs text-green-600 hover:text-green-900 mr-1"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleCurrencyChange(post.id, Math.max(0, post.currency - 10))}
                        className="text-xs text-red-600 hover:text-red-900"
                      >
                        -10
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingPost({
                        id: post.id,
                        name: post.name,
                        description: post.description || '',
                        currency: post.currency
                      })}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemovePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {gameSession.tradingPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No trading posts added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
