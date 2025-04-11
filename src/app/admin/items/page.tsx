'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Pencil, Trash2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Items Management</h1>
        <p className="text-muted-foreground">
          Add, edit, or remove items that can be traded in the game.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>Create a new item that can be traded in the game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="basePrice" className="text-sm font-medium">Base Price</label>
                <Input
                  type="number"
                  name="basePrice"
                  id="basePrice"
                  min="1"
                  step="1"
                  value={newItem.basePrice}
                  onChange={(e) => setNewItem({...newItem, basePrice: Math.floor(parseFloat(e.target.value))})}
                  required
                  onBlur={(e) => {
                    // Ensure the value is a whole number on blur
                    const value = Math.floor(parseFloat(e.target.value));
                    setNewItem({...newItem, basePrice: value});
                  }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="mt-2">
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {editingItem && (
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Edit Item</CardTitle>
            <CardDescription>Update the selected item's details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input
                    type="text"
                    name="edit-name"
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-basePrice" className="text-sm font-medium">Base Price</label>
                  <Input
                    type="number"
                    name="edit-basePrice"
                    id="edit-basePrice"
                    min="1"
                    step="1"
                    value={editingItem.basePrice}
                    onChange={(e) => setEditingItem({...editingItem, basePrice: Math.floor(parseFloat(e.target.value))})}
                    required
                    onBlur={(e) => {
                      // Ensure the value is a whole number on blur
                      const value = Math.floor(parseFloat(e.target.value));
                      setEditingItem({...editingItem, basePrice: value});
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                  <Input
                    type="text"
                    name="edit-description"
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Items</CardTitle>
          <CardDescription>Manage your existing items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Price</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gameSession.items.map((item) => {
                  const isEditing = editingItem && editingItem.id === item.id;

                  return (
                    <tr key={item.id} className={`border-b ${isEditing ? 'bg-muted/30' : 'hover:bg-muted/50'}`}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                              className="h-8 w-full max-w-[200px]"
                              required
                            />
                          ) : (
                            <span className="font-medium">{item.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={editingItem.basePrice}
                            onChange={(e) => setEditingItem({...editingItem, basePrice: Math.floor(parseFloat(e.target.value))})}
                            className="h-8 w-24"
                            required
                            onBlur={(e) => {
                              // Ensure the value is a whole number on blur
                              const value = Math.floor(parseFloat(e.target.value));
                              setEditingItem({...editingItem, basePrice: value});
                            }}
                          />
                        ) : (
                          item.basePrice
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="h-8 w-full"
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (editingItem.name && editingItem.basePrice > 0) {
                                    handleUpdateItem();
                                  } else {
                                    setEditingItem(null);
                                  }
                                }}
                              >
                                Done
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingItem({
                                  id: item.id,
                                  name: item.name,
                                  basePrice: item.basePrice,
                                  description: item.description || ''
                                })}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {gameSession.items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                        <p>No items added yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
