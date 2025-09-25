# Fitwell ERP

## Overview

Fitwell ERP is a comprehensive web-based Enterprise Resource Planning application designed for small manufacturing businesses. The system provides centralized management of core manufacturing operations including product catalogs, customer/supplier relationships, production tracking, sales order management, inventory control, and reporting. Built with a modern full-stack architecture, it offers real-time visibility into manufacturing operations with features for production planning, stock management, and business analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: ShadCN UI components built on Radix UI primitives for accessible, customizable interfaces
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with structured endpoints for each domain (products, parties, production, sales, inventory)
- **Validation**: Zod schemas for runtime type validation and data transformation
- **Database Layer**: Drizzle ORM for type-safe database operations and migrations

### Data Storage
- **Database**: PostgreSQL configured through Drizzle with support for Neon serverless PostgreSQL
- **Schema Design**: Normalized relational schema with proper foreign key relationships
- **Core Tables**: Products, parties (customers/suppliers), production records, sales orders, sales order items, and stock adjustments
- **Data Types**: Decimal precision for weights and prices, proper indexing for performance

### Authentication & Authorization
- Session-based authentication infrastructure prepared (connect-pg-simple for session storage)
- Middleware structure in place for request logging and error handling

### Development & Build System
- **Development**: Hot module replacement with Vite dev server
- **Production Build**: Optimized bundling with esbuild for server-side code
- **Type Checking**: Comprehensive TypeScript configuration with strict mode
- **Code Quality**: Structured project layout with shared schema definitions

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management

### UI & Styling
- **Radix UI**: Headless UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom plugins for development environment and debugging
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Type-safe CSS class composition
- **Nanoid**: Unique ID generation for entities

### Data Management
- **TanStack React Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Runtime type validation and schema definition