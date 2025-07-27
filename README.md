# Next.js E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL. This project features a complete admin dashboard, customer interface, and robust backend API for managing products, orders, users, and more.

## 🚀 Live Demo

**Production URL:** [https://next-js-front-end-backend-integrati.vercel.app](https://next-js-front-end-backend-integrati.vercel.app)

## 🏗️ Architecture & Design Patterns

This project follows modern software architecture principles and design patterns:

### **Repository Pattern**
- **Repositories** (`lib/repositories/`): Handle data access logic and database operations
- **Services** (`lib/services/`): Contain business logic and orchestrate repository calls
- **API Routes** (`app/api/`): Handle HTTP requests and responses, calling services

### **Layered Architecture**
```
┌─────────────────┐
│   Presentation  │ ← React Components, Pages, UI
├─────────────────┤
│   API Layer     │ ← Next.js API Routes
├─────────────────┤
│   Service Layer │ ← Business Logic
├─────────────────┤
│   Repository    │ ← Data Access Layer
├─────────────────┤
│   Database      │ ← PostgreSQL + Prisma ORM
└─────────────────┘
```

### **Component Architecture**
- **Atomic Design**: UI components organized in `components/ui/` following atomic design principles
- **Feature-based Structure**: Admin and customer interfaces separated using Next.js route groups
- **Reusable Components**: Shared components for forms, tables, modals, and navigation

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **shadcn/ui** - Pre-built component library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Primary database (Neon DB)
- **Prisma Accelerate** - Database connection pooling and caching

### **Infrastructure**
- **Vercel** - Deployment and hosting
- **Neon Database** - Serverless PostgreSQL
- **File Upload** - Local file storage with API endpoints

## 📊 Database Schema

The application uses a comprehensive e-commerce database schema with the following main entities:

### **Core Entities**
- **Users** - Customer and admin user management with roles
- **Products** - Product catalog with variants and images
- **Categories** - Hierarchical product categorization
- **Brands** - Product brand management
- **Orders** - Order processing and tracking
- **Cart** - Shopping cart functionality
- **Reviews** - Product reviews and ratings
- **Inventory** - Stock management and tracking

### **Key Features**
- UUID-based primary keys for security
- Hierarchical categories with parent-child relationships
- Product variants for different sizes, colors, etc.
- Multiple product images with featured image support
- Order status tracking and payment management
- User address management
- Wishlist functionality

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon DB account)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd next-js-front-end-backend-integration
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory and copy the contents from `env-example`:

```bash
cp env-example .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# API Base URL
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"

# Optional: Neon DB specific variables
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-prisma-url"
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin dashboard routes
│   │   ├── brands/              # Brand management
│   │   ├── categories/          # Category management
│   │   ├── customers/           # Customer management
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── products/            # Product management
│   │   └── product-variant/     # Variant management
│   ├── (customer)/              # Customer-facing routes
│   │   └── user/                # User profile pages
│   ├── api/                     # API endpoints
│   │   ├── brands/              # Brand CRUD operations
│   │   ├── category/            # Category CRUD operations
│   │   ├── products/            # Product CRUD operations
│   │   ├── product-images/      # Image management
│   │   ├── product-variants/    # Variant management
│   │   ├── upload/              # File upload handling
│   │   └── user/                # User management
│   ├── actions/                 # Server actions
│   ├── components/              # Shared React components
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   └── navbar-components/       # Navigation components
├── lib/                         # Utility libraries
│   ├── repositories/            # Data access layer
│   ├── services/                # Business logic layer
│   ├── prisma.ts               # Prisma client configuration
│   └── utils.ts                # Utility functions
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Database migrations
├── public/                      # Static assets
│   └── uploads/                # Uploaded files
└── utils/                       # Additional utilities
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run studio       # Open Prisma Studio
npm run generate     # Generate Prisma client
```

## 🌐 Deployment

### **Deploy to Vercel**

1. **Connect to Vercel**
   - Fork this repository
   - Connect your GitHub account to Vercel
   - Import the project

2. **Environment Variables**
   Set the following environment variables in Vercel:
   ```
   DATABASE_URL
   NEXT_PUBLIC_API_BASE_URL
   POSTGRES_URL (if using Neon)
   POSTGRES_PRISMA_URL (if using Neon)
   ```

3. **Database Setup**
   - Set up a PostgreSQL database (recommended: Neon DB)
   - Run migrations: `npx prisma migrate deploy`
   - Seed the database: `npx prisma db seed`

4. **Deploy**
   - Push to your main branch
   - Vercel will automatically deploy your application

### **Manual Deployment**

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

## 🔐 Authentication & Authorization

The application includes a role-based authentication system:

- **ADMIN** - Full access to admin dashboard and all features
- **CUSTOMER** - Access to customer-facing features
- **STAFF** - Limited admin access (configurable)

## 📱 Features

### **Admin Dashboard**
- Product management (CRUD operations)
- Category and brand management
- Customer management
- Order processing
- Inventory tracking
- File upload for product images
- Analytics and reporting (planned)

### **Customer Interface**
- Product browsing and search
- Shopping cart functionality
- User profile management
- Order history
- Product reviews
- Wishlist functionality

### **API Features**
- RESTful API endpoints
- File upload handling
- Image management
- Data validation
- Error handling
- TypeScript support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check the [Issues](../../issues) page for existing problems
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Provide environment details

## 🚀 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] SEO optimization
- [ ] Performance monitoring

---

**Built with ❤️ using Next.js and modern web technologies**