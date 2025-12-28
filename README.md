# 🚗 Iconic Limos & Rentals

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)

**A full-stack luxury transportation platform built for the Greater Toronto Area**

[Live Demo](https://iconic-rental.vercel.app) · [Report Bug](https://github.com/yourusername/iconic-limos/issues) · [Request Feature](https://github.com/yourusername/iconic-limos/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Performance](#-performance)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Iconic Limos & Rentals** is a comprehensive, production-ready luxury transportation platform designed to streamline the entire customer journey—from browsing premium vehicles to booking chauffeur services. Built with modern technologies and best practices, the platform serves both customers and administrators through distinct, feature-rich portals.

### 🏢 Business Model

- **Quote-Based Pricing**: All pricing handled through manual quote approval (no public pricing)
- **Luxury Service Focus**: Premium fleet including Buses, SUVs, Rolls Royce, and Sprinter Vans
- **Professional Operations**: Complete admin dashboard for fleet, driver, and booking management
- **Automated Notifications**: Real-time SMS updates via Twilio integration

### 🎨 Design Philosophy

- **Pure Black & White Aesthetic**: Minimalist luxury design language
- **Rounded Interface**: Consistent `rounded-xl` styling across all components
- **Responsive First**: Mobile-optimized with elegant touch interactions
- **Performance Focused**: Lighthouse scores of 100/96/100/100 (Desktop)

---

## ✨ Key Features

### 🌐 Public Website

- **Dynamic Fleet Browsing**
  - Real-time filtering by vehicle category
  - Multi-image carousel with drag/swipe support
  - Detailed vehicle specifications and features
  - SEO-optimized vehicle pages with JSON-LD schema

- **Smart Quote System**
  - Comprehensive multi-section quote request form
  - Vehicle preference selection
  - Event details and special requirements capture
  - Unique quote number generation

- **Content Pages**
  - Services showcase with hover effects
  - About page with company information
  - FAQ section with expandable answers
  - Contact page with direct communication options

### 👥 Customer Portal

- **Account Management**
  - Secure registration and authentication (bcrypt + JWT)
  - Profile editing (name, email, phone, password)
  - Account dashboard with activity overview

- **Booking Management**
  - View all bookings with status tracking
  - Real-time booking status updates
  - Booking history and details

- **Invoice Center**
  - View and download invoices
  - Payment status tracking
  - Invoice history

- **Promotions**
  - Active promotions display
  - Discount code visibility
  - Promotional campaign tracking

### 🔧 Admin Dashboard

- **Fleet Management**
  - Full CRUD operations for vehicles
  - Multi-image gallery support per vehicle
  - URL-based image upload system (Imgur integration)
  - Vehicle availability tracking
  - Fleet utilization statistics

- **Quote Management**
  - Quote approval/rejection workflow
  - Pricing estimation tools
  - Customer communication features
  - Status tracking (PENDING → APPROVED → COMPLETED)
  - Search and filter capabilities

- **Driver Management**
  - Driver profile management
  - License and contact information tracking
  - Availability status management
  - Booking assignment with conflict detection

- **Booking Operations**
  - Visual calendar with color-coded statuses
  - Driver and vehicle assignment
  - Conflict detection system
  - Dispatch management
  - Real-time booking overview

- **Customer Management**
  - Customer database with full search
  - Account activation/deactivation
  - Customer booking history
  - Direct contact options (call/email)

- **Invoice System**
  - Invoice generation and tracking
  - Payment status management
  - Automated invoice numbering
  - Due date tracking

### 🔔 Automation & Integrations

- **SMS Notifications** (Twilio)
  - Booking confirmations
  - Quote status updates
  - Automated delivery tracking

- **Analytics Suite**
  - Google Tag Manager (GTM) integration
  - Google Analytics 4 (GA4) tracking
  - Microsoft Clarity heatmaps and session recordings
  - Google Search Console integration

- **SEO Optimization**
  - Automatic sitemap generation
  - Structured data (JSON-LD) for local business
  - Open Graph tags for social sharing
  - Twitter Card metadata
  - Dynamic meta tags per page

---

## 🛠️ Tech Stack

### Frontend

```typescript
- Next.js 14 (App Router, React Server Components)
- React 18
- TypeScript 5
- TailwindCSS v4 (Utility-first CSS framework)
- Next.js Image Component (Automatic image optimization)
```

### Backend

```typescript
- Next.js API Routes (Serverless Functions)
- Prisma ORM (Type-safe database queries)
- PostgreSQL (via Neon Serverless Database)
- bcrypt (Password hashing - 10 rounds)
- JWT (JSON Web Tokens for authentication)
```

### Infrastructure & Services

```bash
# Hosting & Database
- Vercel (Automatic deployments, Edge Network)
- Neon Database (Serverless PostgreSQL)

# External Services
- Twilio (SMS notifications)
- Imgur (Image hosting CDN)
- Google Tag Manager (Analytics container)
- Google Analytics 4 (User tracking)
- Microsoft Clarity (Behavior analytics)
- Google Search Console (SEO monitoring)
```

### Development Tools

```bash
- npm (Package management)
- Git & GitHub (Version control)
- ESLint (Code quality)
- Prisma Studio (Database GUI)
- PostCSS (CSS processing)
```

---

## 🏗️ Architecture

### Application Structure

```
iconic-limos/
├── 🎨 Frontend (React Server Components + Client Components)
│   ├── Public Website (SEO optimized, image galleries)
│   ├── Customer Portal (Protected routes, dashboard)
│   └── Admin Dashboard (Fleet management, analytics)
│
├── ⚙️ Backend (Next.js API Routes)
│   ├── Authentication APIs (Admin + Customer)
│   ├── Vehicle APIs (CRUD + Image management)
│   ├── Quote APIs (Submission + Approval workflow)
│   ├── Booking APIs (Dispatch + Driver assignment)
│   └── Customer APIs (Profile + Booking management)
│
├── 🗄️ Database Layer (Prisma + PostgreSQL)
│   ├── 8 Core Models (Vehicle, Customer, Booking, etc.)
│   ├── Relationships (One-to-Many, Many-to-One)
│   └── Migrations (Version-controlled schema changes)
│
└── 🔐 Security Layer
    ├── Middleware (Route protection)
    ├── JWT Authentication (HTTP-only cookies)
    ├── Password Hashing (bcrypt)
    └── Input Validation (Client + Server)
```

### Key Design Decisions

1. **Separate Authentication Systems**
   - Distinct admin and customer authentication flows
   - Different JWT tokens and cookie management
   - Role-based access control via middleware

2. **URL-Based Image Upload**
   - Overcame Vercel serverless limitations
   - Integrated Imgur for reliable CDN hosting
   - Supports multi-image galleries per vehicle

3. **Quote-Based Pricing Model**
   - No public pricing display
   - Manual admin approval required
   - Maintains luxury service positioning

4. **Multi-Image Carousel**
   - Draggable desktop interface
   - Swipeable mobile interface
   - Touch-optimized interactions

5. **Conflict Detection System**
   - Prevents double-booking of drivers
   - Validates vehicle availability
   - Real-time conflict resolution

---

## ⚡ Performance

### Lighthouse Scores

```
Desktop:
├── Performance: 100/100 ✅
├── Accessibility: 96/100 ✅
├── Best Practices: 100/100 ✅
└── SEO: 100/100 ✅

Mobile:
├── Performance: 93/100 ✅
├── Accessibility: 96/100 ✅
├── Best Practices: 100/100 ✅
└── SEO: 100/100 ✅
```

### Optimization Techniques

- ✅ **Image Optimization**: Next.js Image component with automatic WebP conversion
- ✅ **Code Splitting**: Automatic route-based code splitting
- ✅ **Lazy Loading**: Below-the-fold content lazy loaded
- ✅ **Edge Deployment**: Vercel Edge Network for global low latency
- ✅ **Database Optimization**: Indexed queries, efficient relationships
- ✅ **CSS Optimization**: TailwindCSS v4 with automatic purging

---

## 📸 Screenshots

### Public Website

<div align="center">

| Homepage Hero | Fleet Browsing |
|:---:|:---:|
| ![Homepage](https://via.placeholder.com/400x250/000000/FFFFFF?text=Homepage+Hero) | ![Fleet](https://via.placeholder.com/400x250/000000/FFFFFF?text=Fleet+Page) |

| Vehicle Details | Quote Request |
|:---:|:---:|
| ![Vehicle Details](https://via.placeholder.com/400x250/000000/FFFFFF?text=Vehicle+Details) | ![Quote](https://via.placeholder.com/400x250/000000/FFFFFF?text=Quote+Form) |

</div>

### Admin Dashboard

<div align="center">

| Dashboard Overview | Fleet Management |
|:---:|:---:|
| ![Admin Dashboard](https://via.placeholder.com/400x250/000000/FFFFFF?text=Admin+Dashboard) | ![Fleet Admin](https://via.placeholder.com/400x250/000000/FFFFFF?text=Fleet+Management) |

| Quote Management | Calendar View |
|:---:|:---:|
| ![Quotes](https://via.placeholder.com/400x250/000000/FFFFFF?text=Quote+Management) | ![Calendar](https://via.placeholder.com/400x250/000000/FFFFFF?text=Booking+Calendar) |

</div>

### Customer Portal

<div align="center">

| Customer Dashboard | Booking History |
|:---:|:---:|
| ![Customer Portal](https://via.placeholder.com/400x250/000000/FFFFFF?text=Customer+Dashboard) | ![Bookings](https://via.placeholder.com/400x250/000000/FFFFFF?text=Booking+History) |

</div>

---

## 🚀 Getting Started

### Prerequisites

```bash
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon account)
- Twilio account (for SMS)
- Git
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/iconic-limos.git
   cd iconic-limos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/database"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   ADMIN_EMAIL="admin@iconiclimos.com"
   ADMIN_PASSWORD_HASH="$2b$10$..." # Generate with bcrypt
   
   # Twilio SMS
   TWILIO_ACCOUNT_SID="AC..."
   TWILIO_AUTH_TOKEN="..."
   TWILIO_PHONE_NUMBER="+1234567890"
   
   # Analytics (Optional)
   NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
   NEXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Generate admin password hash**
   ```bash
   node -e "console.log(require('bcrypt').hashSync('your-password', 10))"
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed database with sample data
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   Navigate to http://localhost:3000
   Admin: http://localhost:3000/admin-login
   Customer: http://localhost:3000/customer/login
   ```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start

# Or deploy to Vercel
vercel deploy --prod
```

---

## 🗄️ Database Schema

### Entity Relationship Overview

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Vehicle   │───────│ VehicleImage │       │   Driver    │
│             │ 1:N   │              │       │             │
│ - id        │       │ - id         │       │ - id        │
│ - name      │       │ - vehicleId  │       │ - name      │
│ - category  │       │ - url        │       │ - license   │
│ - features  │       │ - order      │       │ - phone     │
└──────┬──────┘       └──────────────┘       └──────┬──────┘
       │                                             │
       │ 1:N                                    1:N │
       │                                             │
       │              ┌─────────────┐                │
       └──────────────│   Booking   │────────────────┘
                      │             │
                      │ - id        │──────┐
                      │ - vehicleId │      │
                      │ - driverId  │      │ 1:N
                      │ - customerId│      │
                      │ - eventDate │      │
                      │ - status    │      │
                      └──────┬──────┘      │
                             │             │
                        1:1  │             │
                             │             │
                      ┌──────▼──────┐      │
                      │   Invoice   │      │
                      │             │      │
                      │ - id        │      │
                      │ - bookingId │      │
                      │ - amount    │      │
                      │ - status    │      │
                      └─────────────┘      │
                                           │
       ┌───────────────────────────────────┘
       │
       │              ┌─────────────┐
       │              │  Customer   │
       └──────────────│             │
                 1:N  │ - id        │
                      │ - email     │───────┐
                      │ - password  │       │
                      │ - name      │       │ 1:N
                      │ - phone     │       │
                      └──────┬──────┘       │
                             │              │
                        1:N  │              │
                             │              │
                      ┌──────▼──────┐       │
                      │    Quote    │───────┘
                      │             │
                      │ - id        │
                      │ - customerId│
                      │ - vehicleId │
                      │ - status    │
                      │ - details   │
                      └─────────────┘
```

### Core Models

<details>
<summary><b>Vehicle Model</b></summary>

```prisma
model Vehicle {
  id          String          @id @default(uuid())
  name        String
  category    String          // "Bus", "SUV", "Rolls Royce", "Sprinter Van"
  description String
  features    String          // Comma-separated features
  basePrice   Decimal?        @db.Decimal(10, 2)
  hourlyRate  Decimal?        @db.Decimal(10, 2)
  imageUrl    String          // Primary image
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  images      VehicleImage[]  // Multi-image gallery
  bookings    Booking[]
  quotes      Quote[]
}
```
</details>

<details>
<summary><b>Customer Model</b></summary>

```prisma
model Customer {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String    // bcrypt hashed
  firstName String
  lastName  String
  phone     String?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  bookings  Booking[]
  quotes    Quote[]
  invoices  Invoice[]
}
```
</details>

<details>
<summary><b>Booking Model</b></summary>

```prisma
model Booking {
  id              String   @id @default(uuid())
  bookingNumber   String   @unique
  customerId      String
  vehicleId       String
  driverId        String?
  eventDate       DateTime
  pickupLocation  String
  dropoffLocation String?
  passengers      Int
  hours           Int
  specialRequests String?
  status          String   // PENDING, CONFIRMED, COMPLETED, CANCELLED
  totalPrice      Decimal  @db.Decimal(10, 2)
  paymentStatus   String   // PENDING, PAID, PARTIAL
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  customer        Customer @relation(fields: [customerId], references: [id])
  vehicle         Vehicle  @relation(fields: [vehicleId], references: [id])
  driver          Driver?  @relation(fields: [driverId], references: [id])
  invoice         Invoice?
}
```
</details>

<details>
<summary><b>Full Schema</b></summary>

View the complete schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

</details>

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/admin/login` | Admin login | ❌ |
| `POST` | `/api/customer/login` | Customer login | ❌ |
| `POST` | `/api/customer/register` | Customer registration | ❌ |
| `POST` | `/api/customer/logout` | Customer logout | ✅ |

### Vehicle Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/vehicles` | Get all active vehicles | ❌ |
| `GET` | `/api/vehicles/[id]` | Get single vehicle | ❌ |
| `POST` | `/api/admin/fleet/vehicles` | Create vehicle | ✅ Admin |
| `PUT` | `/api/admin/fleet/vehicles/[id]` | Update vehicle | ✅ Admin |
| `DELETE` | `/api/admin/fleet/vehicles/[id]` | Delete vehicle | ✅ Admin |
| `POST` | `/api/admin/fleet/vehicles/[id]/images` | Add vehicle image | ✅ Admin |
| `DELETE` | `/api/admin/fleet/vehicles/[id]/images/[imageId]` | Delete vehicle image | ✅ Admin |

### Quote Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/quotes` | Submit quote request | ❌ |
| `GET` | `/api/admin/quotes` | Get all quotes | ✅ Admin |
| `PUT` | `/api/admin/quotes/[id]` | Update quote status | ✅ Admin |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/customer/bookings` | Get customer bookings | ✅ Customer |
| `GET` | `/api/admin/bookings` | Get all bookings | ✅ Admin |
| `PUT` | `/api/admin/bookings/[id]` | Update booking | ✅ Admin |
| `PUT` | `/api/admin/bookings/[id]/assign` | Assign driver | ✅ Admin |

### Response Format

All API responses follow this structure:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error message"
}
```

### Example Request

```typescript
// POST /api/quotes
const response = await fetch('/api/quotes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerId: 'uuid',
    vehicleId: 'uuid',
    pickupLocation: '123 Main St, Toronto',
    eventDate: '2025-02-01T10:00:00Z',
    passengers: 8,
    hours: 4,
    specialRequests: 'Need champagne service'
  })
});

const data = await response.json();
```

---

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

2. **Configure Environment Variables**
   - Add all `.env` variables in Vercel dashboard
   - Navigate to: Project → Settings → Environment Variables
   - Add each variable from your local `.env`

3. **Configure Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Preview deployments created for all pull requests
   - Production URL: `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Environment-Specific Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image domains
  images: {
    remotePatterns: [
      { hostname: 'i.imgur.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};
```

---

## 🔮 Future Roadmap

### Phase 1 (Q1 2025) - Post-Launch Enhancements
- [ ] **Payment Integration**
  - Stripe payment processing
  - Automated invoice payments
  - Payment receipt generation
  
- [ ] **Email Notifications**
  - SendGrid or Resend integration
  - Booking confirmations via email
  - Invoice delivery automation

- [ ] **Direct Image Upload**
  - Cloudinary integration
  - Admin file upload interface
  - Automatic image optimization

### Phase 2 (Q2 2025) - Advanced Features
- [ ] **Real-Time Tracking**
  - Live GPS tracking for drivers
  - Customer tracking interface
  - ETA calculations

- [ ] **Enhanced Analytics**
  - Custom admin reports
  - Revenue forecasting
  - Fleet utilization insights
  - Customer behavior analytics

- [ ] **Mobile Application**
  - React Native mobile app
  - Push notifications
  - Mobile-optimized booking flow

### Phase 3 (Q3 2025) - Scale & Optimize
- [ ] **Multi-Language Support**
  - French translation (Canadian market)
  - Dynamic language switching
  - Localized content

- [ ] **Advanced Booking**
  - Recurring bookings
  - Package deals
  - Corporate accounts

- [ ] **Marketing Automation**
  - Email campaigns
  - A/B testing framework
  - Customer segmentation
  - Loyalty program

### Continuous Improvements
- [ ] Accessibility enhancements (WCAG 2.1 AA)
- [ ] Performance monitoring and optimization
- [ ] Security audits and updates
- [ ] Automated testing suite
- [ ] API versioning
- [ ] GraphQL API layer

---

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (ESLint configured)
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR
- Keep PRs focused and atomic

### Code Style

```typescript
// Use TypeScript for all new files
// Follow the existing naming conventions
// Use functional components with hooks
// Implement proper error handling
// Add comments for complex logic
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for seamless deployment and hosting
- **Prisma** for the excellent ORM
- **TailwindCSS** for the utility-first CSS framework
- **Twilio** for reliable SMS services

---

## 📞 Contact & Support

**Iconic Limos & Rentals**  
📧 Email: info@iconiclimos.com  
🌐 Website: [https://iconic-rental.vercel.app](https://iconic-rental.vercel.app)  
📱 Phone: +1 (XXX) XXX-XXXX

**Developer**  
👤 Gurpinderjeet Sandhu
💼 LinkedIn: [Your LinkedIn]  
🐙 GitHub: [@gurpinders](https://github.com/gurpinders)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

[⬆ Back to Top](#-iconic-limos--rentals)

</div>