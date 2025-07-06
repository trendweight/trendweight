# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files for frontend
COPY apps/web/package*.json ./apps/web/
COPY package*.json ./

# Install dependencies
WORKDIR /app/apps/web
RUN npm ci

# Copy frontend source
COPY apps/web/ ./

# Build frontend with production environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build information arguments
ARG BUILD_TIME
ARG BUILD_COMMIT
ARG BUILD_BRANCH
ARG BUILD_VERSION
ARG BUILD_REPO

# Set build information as environment variables for Vite
ENV VITE_BUILD_TIME=$BUILD_TIME
ENV VITE_BUILD_COMMIT=$BUILD_COMMIT
ENV VITE_BUILD_BRANCH=$BUILD_BRANCH
ENV VITE_BUILD_VERSION=$BUILD_VERSION
ENV VITE_BUILD_REPO=$BUILD_REPO

RUN npm run build

# Stage 2: Build backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build

WORKDIR /src

# Copy backend source
COPY apps/api/ ./

# Restore and build
RUN dotnet restore TrendWeight.sln
RUN dotnet publish TrendWeight/TrendWeight.csproj -c Release -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy published backend
COPY --from=backend-build /app/publish .

# Copy frontend build to wwwroot
COPY --from=frontend-build /app/apps/web/dist ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "TrendWeight.dll"]