# Personal Finance Dashboard

## Overview

This is a full-stack personal finance management application built with React, Express, and PostgreSQL. The application provides users with comprehensive financial tracking capabilities including credit card management, transaction monitoring, spending analytics, and investment portfolio tracking. It features a modern, responsive design with dark/light theme support and real-time data visualization through interactive charts and dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **Component Library**: shadcn/ui components with Radix UI primitives for accessibility
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts library for data visualization
- **Theme System**: Custom theme provider supporting light/dark modes

### Backend Architecture
The backend follows a RESTful API design pattern:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints organized by resource (cards, transactions, stocks, etc.)
- **Data Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reloading with Vite integration

### Database Design
Uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **ORM**: Drizzle ORM with schema-first approach
- **Tables**: Cards, Transactions, Stocks, Portfolio Values, User Settings
- **Schema Management**: Migration-based schema changes
- **Data Types**: Decimal precision for financial data, JSON for flexible configurations

### Data Storage Architecture
The application implements a repository pattern through the IStorage interface:

- **Abstraction Layer**: IStorage interface defines all data operations
- **CRUD Operations**: Full create, read, update, delete operations for all entities
- **Analytics**: Specialized methods for financial calculations and reporting
- **Relationships**: Foreign key relationships between cards and transactions

### Authentication & Authorization
Currently implements a simplified user model:

- **User Management**: Basic user settings with default user approach
- **Session Handling**: Prepared for session-based authentication
- **Security**: Input validation and sanitization at API level

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL cloud database service
- **Connection**: Uses @neondatabase/serverless for serverless database connections

### Financial Data APIs
- **Alpha Vantage API**: Stock market data and real-time price feeds
- **Rate Limiting**: Handles API call frequency limits gracefully
- **Fallback Handling**: Graceful degradation when external APIs are unavailable

### Development Services
- **Replit Integration**: Optimized for Replit development environment
- **Vite Plugins**: Custom Replit plugins for development experience enhancement
- **Error Overlay**: Runtime error modal for better debugging

### Third-Party Libraries
- **Radix UI**: Accessible component primitives for complex UI components
- **Lucide React**: Icon library for consistent iconography
- **Date-fns**: Date manipulation and formatting utilities
- **React Hook Form**: Form management with validation
- **Embla Carousel**: Touch-friendly carousel component

### Build & Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS
- **TypeScript**: Static type checking across the entire codebase