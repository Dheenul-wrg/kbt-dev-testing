# KBT Trip Builder

**Version:** 0.1.0  
**Last Updated:** December 2024

A modern Next.js application for building and managing trips with TypeScript, Tailwind CSS, and Prisma.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Tech Stack

- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Prisma 6.13.0** - Database ORM
- **Apollo Client 3.13.9** - GraphQL client
- **ESLint 9** - Code linting
- **Prettier 3.6.2** - Code formatting

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

### Database

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run database seeding
```

## 📁 Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # React components
├── constants/       # Application constants
├── hooks/          # Custom React hooks
├── repository/     # Data access layer
├── services/       # API services
├── styles/         # Global styles
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 🔧 Environment Setup

Create a `.env` file with the following variables:

```env
DATABASE_URL="your-database-url"
# Add other environment variables as needed
```

## 📝 Development Workflow

1. **Code** - Write your code (auto-formatting on save)
2. **Lint** - `npm run lint` to check for issues
3. **Format** - `npm run format` to format code
4. **Type Check** - `npm run type-check` to verify types

## 📄 License

This project is private and proprietary.
