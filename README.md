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
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kbt_trip_builder"

# GraphQL
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:4000/graphql"

# Slack Configuration (Optional)
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
```

### Slack Error Alerting Setup

1. Create a Slack app in your workspace
2. Add the "Incoming Webhooks" feature
3. Create a webhook URL for your desired channel
4. Add the webhook URL to your `.env` file

The Slack integration provides:

- **Simple Error Alerting**: Easy-to-use error reporting with context
- **Localized Messages**: All Slack messages are localized using `next-intl`
- **Automatic Error Handling**: Send errors to Slack with minimal code

#### Usage in API Routes

```typescript
import { sendErrorAlert } from '@/services';

export async function POST(request: NextRequest) {
  try {
    // Your API logic here
  } catch (error) {
    // Send error to Slack
    await sendErrorAlert(error as Error, {
      user: 'user-email',
      action: 'API Action',
      url: request.url,
    });

    // Return error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Simple Usage Examples

```typescript
import { sendErrorAlert } from '@/services';

// Basic error alert
await sendErrorAlert(new Error('Database connection failed'), {
  action: 'Database Query',
});

// Error with user context
await sendErrorAlert(error, {
  user: 'john@example.com',
  action: 'User Login',
  url: '/api/auth/login',
});
```

## 📝 Development Workflow

1. **Code** - Write your code (auto-formatting on save)
2. **Lint** - `npm run lint` to check for issues
3. **Format** - `npm run format` to format code
4. **Type Check** - `npm run type-check` to verify types

## 📄 License

This project is private and proprietary.
