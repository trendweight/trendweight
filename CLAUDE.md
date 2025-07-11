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

### Development Environment
- The dev server is always running
- Frontend logs end up in `logs/frontend.log`
- Backend logs end up in `logs/backend.log`
- Both servers reload automatically when code changes are made
- Both log files are very long so you generally should `tail -100` or `-200` (depending on if you expect verbose debugging output that will generate many lines of output)

### Reference Implementation
If `trendweight-classic/` folder exists locally, it contains the legacy C# MVC application for reference when implementing features or comparing with the live site. This folder is not part of the repository.

[... rest of the existing content remains the same ...]