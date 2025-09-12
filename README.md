# Movies Management App

![Next.js](https://img.shields.io/badge/Next.js-15.0.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-blue.svg)
![License: Public](https://img.shields.io/badge/License-Public-brightgreen.svg)

**Movies Management App** is a modern, full-stack web application built with Next.js 15 that provides a comprehensive platform for managing personal movie collections. The app features a clean, Firecrawl-inspired UI design with robust authentication, CRUD operations, internationalization support, and seamless cloud integration for image storage.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [🚀 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies Used](#️-technologies-used)
- [📄 API Documentation](#-api-documentation)
- [🔧 Configuration](#-configuration)
- [🌍 Environment Variables](#-environment-variables)
- [� Security Features](#-security-features)

## 📋 Getting Started

### Prerequisites

- **Node.js:** Version 18.0 or higher. Download from [nodejs.org](https://nodejs.org/)
- **Package Manager:** npm, yarn, pnpm, or bun
- **MongoDB:** Database instance (local or cloud via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **AWS Account:** For S3 image storage (optional but recommended)
- **Resend Account:** For email functionality (sign-up notifications)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mrugank92/next-demo.git
   cd next-demo
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup:**

   Create a `.env.local` file in the root directory with the following variables:

   ```bash
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_jwt_secret_key

   # AWS S3 (for image uploads)
   AWS_BUCKET_NAME=your_s3_bucket_name
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_URL=your_s3_bucket_url

   # Email Service
   RESEND_API_KEY=your_resend_api_key

   # External APIs
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Initialize the Database:**

   ```bash
   # Optional: Populate with sample movie data
   npm run fetch
   ```

5. **Run the Development Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Live Demo

- **Repository:** [GitHub Repo](https://github.com/mrugank92/next-demo)
- **Live Application:** [Access Live Demo](https://next-demo-eight-kappa.vercel.app/en)

Default Login Credentials:

- **Username:** `user@gmail.com`
- **Password:** `mymovies`

## ✨ Features

### 🔐 Authentication & Security

- ✅ **Secure Authentication:** JWT-based user authentication with HttpOnly cookies
- ✅ **Password Encryption:** Bcrypt password hashing for enhanced security
- ✅ **Rate Limiting:** Built-in protection against brute force attacks
- ✅ **Input Validation:** Zod schema validation for all API endpoints

### 🎬 Movie Management

- ✅ **Full CRUD Operations:** Create, Read, Update, and Delete movies
- ✅ **Image Upload:** AWS S3 integration for movie poster storage
- ✅ **TMDB Integration:** Fetch movie data from The Movie Database API
- ✅ **Advanced Search:** Filter and paginate through movie collections
- ✅ **Movie Details:** Comprehensive movie information display

### 🎨 User Experience

- ✅ **Modern UI Design:** Clean, Firecrawl-inspired interface with smooth animations
- ✅ **Responsive Design:** Optimized for all devices and screen sizes
- ✅ **Dark/Light Theme:** Elegant theme with proper contrast ratios
- ✅ **Interactive Elements:** Hover effects and micro-animations
- ✅ **Form Validation:** Real-time validation with user-friendly error messages

### 🌍 Internationalization

- ✅ **Multi-language Support:** English, Spanish, and Hindi localization
- ✅ **Dynamic Language Switching:** Change language without page refresh
- ✅ **Localized Content:** All UI elements and messages translated

### ⚡ Performance & Technical

- ✅ **Server-Side Rendering:** Next.js 15 with App Router for optimal performance
- ✅ **State Management:** Redux Toolkit for efficient state handling
- ✅ **API Documentation:** Comprehensive Swagger documentation
- ✅ **Logging System:** Winston-based logging for development and production
- ✅ **Email Notifications:** Welcome emails via Resend service

## 🏗️ Architecture

This application follows a modern, scalable architecture pattern:

### Frontend Architecture

- **Next.js 15 App Router:** Latest Next.js features with server components
- **Component-Based Design:** Modular, reusable React components
- **State Management:** Redux Toolkit for global state management
- **Styling:** Tailwind CSS with custom design system variables
- **Type Safety:** Full TypeScript implementation

### Backend Architecture

- **API Routes:** Next.js API routes for serverless functions
- **Database Layer:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with secure cookie handling
- **File Storage:** AWS S3 for image uploads and management
- **Email Service:** Resend for transactional emails

### Key Design Patterns

- **Middleware Pattern:** Authentication and rate limiting middleware
- **Repository Pattern:** Data access abstraction
- **Validation Layer:** Zod schemas for data validation
- **Error Handling:** Centralized error handling and logging
- **Response Formatting:** Consistent API response structure

## 🛠️ Technologies Used

### Core Framework

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom Design System** - Firecrawl-inspired color palette and components
- **Responsive Design** - Mobile-first approach

### Backend & Database

- **[MongoDB](https://www.mongodb.com/)** - NoSQL document database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing

### State Management & Data Fetching

- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[SWR](https://swr.vercel.app/)** - Data fetching and caching
- **[Axios](https://axios-http.com/)** - HTTP client

### Cloud Services

- **[AWS S3](https://aws.amazon.com/s3/)** - File storage and CDN
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - Cloud database
- **[Vercel](https://vercel.com/)** - Deployment and hosting
- **[Resend](https://resend.com/)** - Email delivery service

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Winston](https://github.com/winstonjs/winston)** - Logging
- **[Zod](https://zod.dev/)** - Schema validation
- **[Swagger](https://swagger.io/)** - API documentation

## 📄 API Documentation

Explore the comprehensive API documentation with interactive examples:

- **Swagger UI:** [API Documentation](https://next-demo-eight-kappa.vercel.app/api-doc)
- **Base URL:** `https://next-demo-eight-kappa.vercel.app/api`

### Available Endpoints

#### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/logout` - User logout

#### Movies

- `GET /api/movies` - Fetch movies with pagination
- `POST /api/movies` - Create a new movie
- `GET /api/movies/[id]` - Get movie by ID
- `PUT /api/movies/[id]` - Update movie
- `DELETE /api/movies/[id]` - Delete movie

#### File Upload

- `POST /api/upload` - Upload images to AWS S3

All endpoints include comprehensive request/response schemas and examples in the Swagger documentation.

## 🔧 Configuration

### Package Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run fetch        # Populate database with sample movies
```

### Next.js Configuration

The application uses several Next.js optimizations:

- **Image Optimization:** WebP and AVIF format support
- **Bundle Splitting:** Optimized vendor and common chunks
- **Compression:** Gzip compression enabled
- **Security Headers:** CSP and other security configurations
- **Internationalization:** Built-in i18n routing

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# AWS S3 Configuration
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_URL=https://your-bucket.s3.amazonaws.com

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key

# External APIs
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Optional: For development
NODE_ENV=development
```

### Environment Variable Details

| Variable                   | Description                      | Required |
| -------------------------- | -------------------------------- | -------- |
| `MONGODB_URI`              | MongoDB connection string        | ✅       |
| `JWT_SECRET`               | Secret key for JWT token signing | ✅       |
| `AWS_BUCKET_NAME`          | S3 bucket for image storage      | ✅       |
| `AWS_REGION`               | AWS region for S3 bucket         | ✅       |
| `AWS_ACCESS_KEY_ID`        | AWS access key                   | ✅       |
| `AWS_SECRET_ACCESS_KEY`    | AWS secret key                   | ✅       |
| `AWS_URL`                  | S3 bucket URL                    | ✅       |
| `RESEND_API_KEY`           | API key for email service        | ✅       |
| `NEXT_PUBLIC_TMDB_API_KEY` | The Movie Database API key       | ⚠️       |

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **HttpOnly Cookies:** Prevents XSS attacks
- **Rate Limiting:** Protection against brute force attacks
- **Input Validation:** Zod schema validation on all inputs
- **CORS Configuration:** Proper cross-origin resource sharing
- **Security Headers:** CSP, HSTS, and other security headers
- **Environment Variable Protection:** Sensitive data secured

### Key Features Showcased

- Clean, modern Firecrawl-inspired design
- Responsive card-based layout
- Smooth animations and hover effects
- Intuitive form design with validation
- Professional typography and spacing
