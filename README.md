# Xperience Intelligence Studio

A prototype for an intelligence platform that provides data insights and analytics.

## Demo Mode

This application can be deployed in two modes:

1. **Full Mode**: With full functionality and API connectivity
2. **Demo Mode**: Read-only version with mock data (default)

## Deployment Instructions

### Option 1: Deploy to Netlify (Recommended for Demo)

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Sign up for a free account at [Netlify](https://www.netlify.com/)
   - Connect your GitHub repository
   - Set the build command to `npm run build`
   - Set the publish directory to `build`
   - Deploy!

### Option 2: Deploy to Vercel

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   - Sign up for a free account at [Vercel](https://vercel.com/)
   - Connect your GitHub repository
   - Vercel will automatically detect the React application
   - Deploy!

### Option 3: Deploy to GitHub Pages

1. Add the following to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

2. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Switching Between Modes

To switch between demo mode and full mode, edit the `src/config/config.ts` file:

```typescript
// Set this to false for full functionality
export const IS_DEMO_MODE = true;
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Data visualization and analytics
- User segmentation
- Attribute management
- Interactive dashboards
- Search functionality

## Technologies Used

- React
- TypeScript
- Material UI
- Express.js (for backend)
- PostgreSQL (for database) 