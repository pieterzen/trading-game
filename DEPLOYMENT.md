md# Vercel Deployment Instructions for Trading Game

This document provides step-by-step instructions for deploying the Trading Game application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub, GitLab, or email)
2. Git repository with your Trading Game code (optional but recommended)

## Deployment Steps

### Option 1: Deploy from Git Repository (Recommended)

1. **Push your code to a Git repository**
   - Create a repository on GitHub, GitLab, or Bitbucket
   - Add the necessary files to Git:

   ```bash
   # Initialize Git repository if not already done
   git init
   
   # Add all necessary files
   git add .gitignore README.md DEPLOYMENT.md TESTING.md
   git add src/ public/ migrations/
   git add package.json tsconfig.json next.config.ts tailwind.config.ts
   git add postcss.config.mjs eslint.config.mjs wrangler.toml
   
   # Files/folders to exclude from Git:
   # - node_modules/ (automatically excluded by .gitignore)
   # - .next/ (build output, automatically excluded by .gitignore)
   # - .wrangler/ (local state, automatically excluded by .gitignore)
   # - Any local environment files (.env.local, etc.)
   ```
   
   - Commit and push your code to the repository:
   
   ```bash
   git commit -m "Initial commit of Trading Game"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Connect Vercel to your Git provider**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Select your Git provider and authorize Vercel if needed
   - Find and select your Trading Game repository

3. **Configure project settings**
   - Framework Preset: Select "Next.js"
   - Root Directory: Leave as default (or specify if your project is in a subdirectory)
   - Build Command: Leave as default (`next build`)
   - Output Directory: Leave as default
   - Environment Variables: None required for this project

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a URL to access your deployed application

### Option 2: Deploy from Local Directory

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to your project directory**
   ```bash
   cd /path/to/trading-game-app
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
5. **Follow the CLI prompts**
   - Set up and deploy: `Y`
   - Link to existing project: `N`
   - Project name: Accept default or enter custom name
   - Framework preset: Select `Next.js`
   - Root directory: `.` (current directory)
   - Override settings: `N`

6. **Access your deployed application**
   - Vercel will provide a URL to your deployed application
   - You can also find it in your Vercel dashboard

## Post-Deployment

- Your application is now live and accessible via the provided URL
- Any changes pushed to the main branch of your repository will automatically trigger a new deployment (if using Git deployment)
- You can configure custom domains in the Vercel dashboard

## Local Development vs. Production

The Trading Game application uses client-side storage (localStorage) to maintain game state. This means:

1. Each user accessing the application will have their own independent game state
2. Game data is stored in the browser and will persist between sessions for the same user
3. There is no shared database between users

This design makes the application perfect for local gameplay scenarios where all trading posts are managed from the same device or for demonstration purposes.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Custom Domain Configuration](https://vercel.com/docs/concepts/projects/domains)
