# Data Intelligence Hub

A modern React application for data intelligence and analytics.

## Features

- Modern React with TypeScript
- Material-UI components with custom theming
- Comprehensive routing system
- Data visualization with Recharts
- PostgreSQL database integration
- Express.js backend server

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (for backend)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sachetray/xis-app.git
   cd xis-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   For full-stack development (frontend + backend):
   ```bash
   npm run dev:full
   ```

## Available Scripts

- `npm start` - Start the frontend development server
- `npm run build` - Build the production-ready frontend
- `npm run server` - Start the backend development server
- `npm run dev` - Alias for `npm start`
- `npm run dev:full` - Start both frontend and backend servers
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run deploy` - Deploy to GitHub Pages

## Code Quality

This project uses several tools to maintain code quality:

- **TypeScript** for static type checking
- **ESLint** for code linting
- **Prettier** for code formatting
- **husky** (coming soon) for Git hooks

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── services/      # API services
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── config/        # Configuration files
├── data/          # Static data and constants
└── scripts/       # Build and utility scripts
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and ensure code quality
   ```bash
   npm run lint
   npm run format
   ```
4. Submit a pull request

## License

This project is private and confidential.
