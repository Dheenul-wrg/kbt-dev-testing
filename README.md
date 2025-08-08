# KBT Trip Builder

A modern Next.js application with TypeScript, Tailwind CSS, ESLint, and Prettier configured for optimal development experience.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code linting
- **Prettier** for code formatting
- **Prisma** for database management
- **Modern development tools** for optimal experience
- **VS Code** optimized settings

## 📦 Installation

```bash
npm install
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run type-check   # Run TypeScript type checking
```

### Database

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run database seeding (no sample data)
```

### Release

```bash
npm run release        # Run semantic-release
npm run release:dry-run # Test release without publishing
```

## 🎨 Code Formatting

This project uses Prettier for code formatting with the following configuration:

- **Semicolons**: Enabled
- **Single quotes**: Enabled
- **Trailing commas**: ES5
- **Print width**: 80 characters
- **Tab width**: 2 spaces
- **Arrow function parentheses**: Avoid when possible

## 🔧 ESLint Configuration

ESLint is configured with:

- Next.js recommended rules
- TypeScript support
- Prettier integration (avoids conflicts)

## 📁 Project Structure

```
kbt-trip-builder/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/    # React components
│   ├── constants/     # Application constants and configuration
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Third-party library utilities
│   ├── services/      # API services and external integrations
│   ├── styles/        # Global styles and theme configuration
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions and helpers
├── prisma/            # Database schema and migrations
├── public/            # Static assets
├── .vscode/           # VS Code settings
├── .prettierrc        # Prettier configuration
├── .prettierignore    # Prettier ignore rules
├── eslint.config.mjs  # ESLint configuration
└── package.json       # Dependencies and scripts
```

### 📂 Directory Purposes

- **`app/`**: Next.js App Router pages and layouts
- **`components/`**: Reusable React components
- **`constants/`**: Application-wide constants, configuration values, and enums
- **`hooks/`**: Custom React hooks for shared logic
- **`lib/`**: Third-party library configurations and utilities
- **`services/`**: API calls, external service integrations, and data fetching
- **`styles/`**: Global styles, theme configuration, and CSS utilities
- **`types/`**: TypeScript type definitions and interfaces
- **`utils/`**: Helper functions, formatters, and utility functions
- **`prisma/`**: Database schema and migrations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
4. Set up the database (when ready):
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:push      # Push schema to database
   ```
5. Start development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Development Workflow

1. **Write code** - VS Code will auto-format on save
2. **Run linting** - `npm run lint` to check for issues
3. **Fix issues** - `npm run lint:fix` to auto-fix ESLint issues
4. **Format code** - `npm run format` to format with Prettier
5. **Type check** - `npm run type-check` to verify TypeScript

## 🛠️ VS Code Extensions

Recommended extensions for the best development experience:

- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**

## 📄 License

This project is private and proprietary.
