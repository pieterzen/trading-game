'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function TradingPostsManagement() {
  const { gameSession, addTradingPost, updateTradingPost, removeTradingPost } = useGameContext();
  const [newPost, setNewPost] = React.useState({ name: '', description: '' });
  const [editingPost, setEditingPost] = React.useState<null | { id: string, name: string, description: string }>(null);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.name) {
      addTradingPost({
        id: Math.random().toString(36).substring(2, 9),
        name: newPost.name,
        description: newPost.description,
        isActive: true,
        inventory: {},
        currency: 100 // Default starting currency
      });
      setNewPost({ name: '', description: '' });
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
          description: editingPost.description
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trading Posts Management</h1>
        <p className="text-muted-foreground">
          Create and manage trading posts in the game.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Trading Post</CardTitle>
          <CardDescription>Create a new trading location for the game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={newPost.name}
                  onChange={(e) => setNewPost({...newPost, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Button type="submit" className="mt-2">
                Add Trading Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {editingPost && (
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Edit Trading Post</CardTitle>
            <CardDescription>Update the selected trading post's details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input
                    type="text"
                    name="edit-name"
                    id="edit-name"
                    value={editingPost.name}
                    onChange={(e) => setEditingPost({...editingPost, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                  <Input
                    type="text"
                    name="edit-description"
                    id="edit-description"
                    value={editingPost.description}
                    onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
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
                  onClick={() => setEditingPost(null)}
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
          <CardTitle>Current Trading Posts</CardTitle>
          <CardDescription>Manage your existing trading posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gameSession.tradingPosts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{post.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{post.description}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/trading-post/${post.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPost({
                            id: post.id,
                            name: post.name,
                            description: post.description || ''
                          })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleRemovePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {gameSession.tradingPosts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="h-8 w-8 text-muted-foreground/50" />
                        <p>No trading posts added yet</p>
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
