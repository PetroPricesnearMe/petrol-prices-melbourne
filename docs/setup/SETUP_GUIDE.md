# 🚀 Complete Setup Guide

This guide consolidates all setup information for the Melbourne Petrol Stations project.

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn package manager
- Git

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your Baserow token:
BASEROW_TOKEN=your_actual_baserow_token_here
```

### 4. Start Backend (TypeScript Version)

```bash
# Development with auto-reload
npm run dev

# Production build and start
npm run build
npm start
```

## 🎯 Frontend Setup

### 1. Navigate to Project Root

```bash
cd ..  # from backend directory
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start Frontend Development Server

```bash
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔧 Development Workflow

Use the TypeScript backend for all development:

- `npm run dev` - Development with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run type-check` - Check types without building

## ⚠️ Important Notes

- The project now uses the **TypeScript backend** (`src/server.ts`)
- The old JavaScript server (`server.js`) is deprecated
- **Required**: Set `BASEROW_TOKEN` environment variable
- **Optional**: Configure Sentry, Redis for advanced features

## 🆘 Troubleshooting

See [Debugging Guide](../development/DEBUGGING.md) for common issues and solutions.
