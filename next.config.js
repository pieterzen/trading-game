/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Output static files that Firebase Hosting can serve, but only in production
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',

  // Disable image optimization since Firebase Hosting doesn't support it
  images: {
    unoptimized: true,
  },

  // Ensure trailing slashes for consistent routing
  trailingSlash: true,

  // Experimental features to help with static generation
  experimental: {
    // This helps with static site generation for dynamic routes
    serverComponentsExternalPackages: ['@/lib/types'],
  },
};

module.exports = nextConfig;
