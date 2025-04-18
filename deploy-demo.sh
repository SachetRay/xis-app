#!/bin/bash

# Deploy Demo Script
# This script builds and prepares the application for deployment as a read-only demo

echo "🚀 Preparing Xperience Intelligence Studio for demo deployment..."

# Ensure we're in demo mode
echo "📝 Setting demo mode..."
sed -i '' 's/IS_DEMO_MODE = false/IS_DEMO_MODE = true/g' src/config/config.ts

# Copy demo environment file
echo "📋 Setting up demo environment..."
cp .env.demo .env

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📦 Your demo is ready to be deployed!"
echo ""
echo "Deployment options:"
echo "1. Deploy to Netlify: https://app.netlify.com/start"
echo "2. Deploy to Vercel: https://vercel.com/new"
echo "3. Deploy to GitHub Pages: npm run deploy (after setting up gh-pages)"
echo ""
echo "For more details, see the README.md file." 