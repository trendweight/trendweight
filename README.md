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
  - Provider integrations for Withings and Fitbit (NEW)

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

   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your actual values. See `.env.example` for all required variables.
   
   For local development, you'll also need:
   
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
     },
     "Fitbit": {
       "ClientId": "your-fitbit-client-id",
       "ClientSecret": "your-fitbit-client-secret",
       "RedirectUri": "http://localhost:5173/oauth/fitbit/callback"
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
- `npm run docker:build` - Build Docker container locally
- `npm run docker:run` - Run the Docker container locally

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

## Docker Build & Deployment

### Building the Container Locally

The application can be containerized for production deployment. The Docker build process:
1. Builds the Vite frontend with production optimizations
2. Builds the ASP.NET Core backend
3. Packages everything into a single container where the backend serves the frontend static files

To build locally:
```bash
npm run docker:build
```

This reads environment variables from your `.env` file for the build process.

To run the container:
```bash
npm run docker:run
```

The container exposes port 8080 and includes health checks at `/api/health`.

### Environment Variables

The application uses different environment variables at build time vs runtime:

**Build-time variables** (used when building the frontend):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Runtime variables** (passed when running the container):
- `Supabase__Url` - Your Supabase project URL
- `Supabase__AnonKey` - Your Supabase anonymous key
- `Supabase__ServiceKey` - Your Supabase service role key
- `Supabase__JwtSecret` - Your Supabase JWT secret
- `Withings__ClientId` - Withings OAuth client ID
- `Withings__ClientSecret` - Withings OAuth client secret
- `Fitbit__ClientId` - Fitbit OAuth client ID
- `Fitbit__ClientSecret` - Fitbit OAuth client secret
- `Jwt__SigningKey` - JWT signing key for the API

### GitHub Actions CI/CD

The repository includes automated CI/CD using GitHub Actions:

1. **Continuous Integration**: On every push and pull request
   - Runs frontend checks (TypeScript, ESLint)
   - Runs backend checks (build, tests)
   - Builds Docker container to verify it works

2. **Continuous Deployment**: On push to `main` branch
   - All CI checks run
   - Docker container is built and pushed to GitHub Container Registry
   - Image is available at `ghcr.io/[your-username]/trendweight:latest`

#### Setting up GitHub Actions

To enable the CI/CD pipeline, configure these secrets in your GitHub repository settings:

1. Go to Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `VITE_SUPABASE_URL` - Your Supabase URL (for frontend build)
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key (for frontend build)

The workflow uses the built-in `GITHUB_TOKEN` for pushing to GitHub Container Registry, so no additional registry authentication is needed.

#### Using the Published Container

After the CI/CD pipeline runs on the main branch, you can pull and run the container:

```bash
# Pull the latest image
docker pull ghcr.io/[your-username]/trendweight:latest

# Run with environment variables
docker run -d \
  -p 8080:8080 \
  -e Supabase__Url="your-supabase-url" \
  -e Supabase__AnonKey="your-anon-key" \
  -e Supabase__ServiceKey="your-service-key" \
  -e Supabase__JwtSecret="your-jwt-secret" \
  -e Withings__ClientId="your-withings-client-id" \
  -e Withings__ClientSecret="your-withings-client-secret" \
  -e Fitbit__ClientId="your-fitbit-client-id" \
  -e Fitbit__ClientSecret="your-fitbit-client-secret" \
  -e Jwt__SigningKey="your-signing-key" \
  ghcr.io/[your-username]/trendweight:latest
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