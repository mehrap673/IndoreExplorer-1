# Overview

This is a full-stack web application called "All About Indore" - a comprehensive multi-page responsive website showcasing the culture, attractions, cuisine, events, and information about Indore, the heart of Madhya Pradesh. The application is built as a modern tourism and city information portal featuring real-time weather data, news updates, and extensive content about places to visit, local food, events, and a photo gallery.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application using functional components and hooks
- **Wouter**: Lightweight client-side routing library for navigation
- **Vite**: Modern build tool for fast development and optimized production builds
- **Tailwind CSS + shadcn/ui**: Utility-first styling with pre-built component library
- **Framer Motion**: Animation library for smooth page transitions and interactive effects
- **TanStack Query**: Data fetching and caching for API requests

## Backend Architecture
- **Express.js**: Node.js web server framework handling API routes and serving static files
- **TypeScript**: Full-stack type safety with shared schemas
- **Development Mode**: Vite middleware integration for hot module replacement
- **Production Mode**: Static file serving with optimized builds

## Data Storage Solutions
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **In-Memory Storage**: Fallback storage implementation for development/testing
- **Session Storage**: PostgreSQL-backed session management using connect-pg-simple

## Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL storage
- **User Management**: Basic user registration and login functionality
- **Contact Form**: Message storage with validation using Zod schemas

## External Dependencies

### Third-party APIs
- **OpenWeatherMap API**: Real-time weather data and forecasts for Indore
- **News API**: Latest news articles related to Indore and surrounding areas

### UI Component Libraries
- **Radix UI**: Headless components for accessibility and functionality
- **shadcn/ui**: Pre-styled component system built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Database and Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Unsplash**: External image hosting for placeholder content

### Development Tools
- **Replit Integration**: Development environment optimizations
- **PostCSS + Autoprefixer**: CSS processing pipeline
- **Drizzle Kit**: Database migration and schema management tools

### Asset Management
- **Google Fonts**: Typography (DM Sans, Geist Mono, Architects Daughter)
- **Image Optimization**: Responsive images with proper loading strategies
- **PWA Support**: Manifest and service worker capabilities for installable web app