# TrendWeight

A web application for tracking weight trends by integrating with smart scales from Withings and Fitbit.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg)](https://vitejs.dev/)

## Features

- 📊 Weight trend visualization with moving averages
- 🔄 Automatic sync with Withings and Fitbit smart scales
- 📱 Responsive design for mobile and desktop
- 🔐 Authentication with Supabase Auth
- 📈 Goal tracking and progress monitoring
- 🌍 Metric and imperial unit support

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: C# ASP.NET Core Web API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- A Supabase project (for database and authentication)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/trendweight/trendweight.git
   cd trendweight
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Start the development servers:
   ```bash
   npm run dev
   ```

   This starts both the frontend (http://localhost:5173) and backend (http://localhost:5199) servers.

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all workspaces for production
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Run linting in all workspaces
- `npm run format` - Format code in all workspaces

### Docker

Build and run with Docker:
```bash
npm run docker:build
npm run docker:run
```

## Deployment

The application is containerized and can be deployed to any platform that supports Docker. GitHub Actions automatically builds and publishes images to GitHub Container Registry on push to main.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Original TrendWeight concept by Erv Walter
- Built with modern open-source technologies
- Community contributions and feedback