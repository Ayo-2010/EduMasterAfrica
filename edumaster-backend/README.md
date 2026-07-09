# EduMaster Africa API

## Backend Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens (change in production)
- `OPENAI_API_KEY` - For AI tutor features
- `PAYSTACK_SECRET_KEY` / `FLUTTERWAVE_SECRET_KEY` - Payment providers

### Development

```bash
# Start dev server
npm run start:dev

# API docs available at
http://localhost:4000/api/v1/docs
```

### Production

```bash
# Build
npm run build

# Start
npm run start:prod
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/:id` - Get single course
- `POST /api/v1/courses/:id/enroll` - Enroll in course

### Questions
- `GET /api/v1/questions/subjects` - Get subjects
- `GET /api/v1/questions` - Get questions with filters
- `GET /api/v1/questions/search?q=` - Search questions

### CBT
- `POST /api/v1/cbt/attempts` - Start exam attempt
- `POST /api/v1/cbt/attempts/:id/submit` - Submit attempt
- `GET /api/v1/cbt/attempts` - Get user attempts

### AI
- `POST /api/v1/ai/chat` - Chat with AI tutor
- `POST /api/v1/ai/questions` - Generate questions
- `POST /api/v1/ai/math` - Solve math problem
- `POST /api/v1/ai/essay` - Grade essay

### Payments
- `POST /api/v1/payments/paystack` - Initialize Paystack
- `POST /api/v1/payments/flutterwave` - Initialize Flutterwave
- `GET /api/v1/payments/verify?reference=` - Verify payment
- `GET /api/v1/payments/plans` - Get plans

### Analytics
- `GET /api/v1/analytics/stats` - User stats
- `GET /api/v1/analytics/mastery` - Subject mastery
- `GET /api/v1/analytics/leaderboard` - Leaderboard