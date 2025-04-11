import { defaultTradingPosts } from '@/lib/types';

// Generate static params for all trading posts
// This is required when using output: 'export' in next.config.js
export async function generateStaticParams() {
  // Return an array of objects with id params
  return defaultTradingPosts.map((post) => ({
    id: post.id,
  }));
}
