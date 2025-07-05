# TrendWeight

A web application for tracking weight trends by integrating with smart scales from Withings and Fitbit.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg)](https://vitejs.dev/)

## Architecture

TrendWeight uses a modern web architecture:

- **Frontend**: React + TypeScript SPA built with Vite
  - Tailwind CSS v4 for styling
  - TanStack Router for routing
  - TanStack Query for server state management
  - Highcharts for data visualization
  - Supabase Auth for authentication

- **Backend**: C# ASP.NET Core Web API
  - Supabase (PostgreSQL) for data storage
  - JWT-based authentication
  - Provider integrations for Withings and Fitbit

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- A Supabase project (for database and authentication)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/trendweight/trendweight.git
   cd trendweight
   ```

2. Install dependencies:
   ```bash
   npm install
   cd apps/web && npm install
   ```

3. Set up environment variables:
   
   Frontend (`apps/web/.env.local`):
   ```
   VITE_API_URL=http://localhost:5199
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   Backend (`apps/api/TrendWeight/appsettings.Development.json`):
   ```json
   {
     "Supabase": {
       "Url": "your-supabase-url",
       "AnonKey": "your-anon-key",
       "ServiceKey": "your-service-key",
       "JwtSecret": "your-jwt-secret"
     },
     "Withings": {
       "ClientId": "your-withings-client-id",
       "ClientSecret": "your-withings-client-secret"
     }
   }
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

   This starts both the frontend (http://localhost:5173) and backend (http://localhost:5199) servers.

### Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run backend tests
- `npm run check` - Run TypeScript and ESLint checks on frontend
- `npm run clean` - Clean all build artifacts and dependencies

## Project Structure

```
trendweight/
├── apps/
│   ├── api/                 # C# ASP.NET Core backend
│   │   └── TrendWeight/
│   │       ├── Features/    # Feature-based organization
│   │       └── Infrastructure/
│   └── web/                 # React frontend
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── features/    # Feature modules
│       │   ├── lib/         # Utilities and API client
│       │   └── routes/      # Page components
│       └── public/          # Static assets
├── logs/                    # Development server logs
└── package.json            # Root package configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) 2020-2025 Erv Walter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.