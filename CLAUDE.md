# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TrendWeight is a web application for tracking weight trends by integrating with smart scales from Withings and Fitbit. The application uses a modern architecture with a C# ASP.NET Core API backend and a Vite + React frontend.

### Project Name Convention
- The project name is **TrendWeight** (capital T, capital W, no space)
- Use this capitalization consistently in code, namespaces, and project names

## Architecture

### Backend (C# API - `apps/api`)
- **ASP.NET Core 9.0** Web API
- **Supabase** for data storage (PostgreSQL with JSONB)
- **JWT authentication** supporting Supabase Auth
- **System.Text.Json** for JSON serialization
- **Feature-based folder structure**

### Frontend (Vite React - `apps/web`)  
- **Vite** with React 19 and TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible UI components
- **TanStack Query** (React Query) for server state
- **TanStack Router** for type-safe routing
- **Supabase Auth** for authentication
- **Highcharts** for data visualization
- **@bprogress/react** for progress indicators
- **@js-joda/core** for date/time handling
- **react-icons** for icons

### Reference Implementation
If `trendweight-classic/` folder exists locally, it contains the legacy C# MVC application for reference when implementing features or comparing with the live site. This folder is not part of the repository.

[... rest of the existing content remains the same ...]