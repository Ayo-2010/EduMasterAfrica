# EduMaster Africa - Production Ready Stack

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend  │────▶│  NestJS Backend   │────▶│  PostgreSQL DB    │
│  (Vite + TanStack)│     │(JWT + Swagger)   │     │  + Redis Cache   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
  http://localhost:3000    http://localhost:4000    localhost:5432
```

## Quick Start

### Backend Setup

```bash
cd edumaster-backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (requires PostgreSQL running)
npx prisma migrate dev

# Start dev server
npm run start:dev
```

### Frontend Setup

```bash
cd design

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Docker (Recommended for Production)

```bash
cd edumaster-backend

# Start all services
docker-compose up -d

# The app will be available at:
# Frontend: http://localhost:3000
# API: http://localhost:4000/api/v1
# Docs: http://localhost:4000/api/v1/docs
```

## Features Implemented

### Phase 1 - MVP ✅
- [x] User Authentication (register/login/JWT)
- [x] Role-based access (student/teacher/parent/school)
- [x] CBT Engine (practice/exam/mock modes)
- [x] Question Bank with filters
- [x] Basic Analytics & Leaderboard
- [x] Payment integration (Paystack/Flutterwave)

### Phase 2 - Core Features
- [x] Courses & enrollments
- [x] Teacher portal & CBT creation
- [x] Parent portal & progress tracking
- [x] AI Tutor (chat/questions/math/essay)

### Phase 3 - Advanced
- [x] Live classes (Socket.IO ready)
- [x] Notifications system
- [x] Gamification (XP, badges, streaks)

## API Endpoints

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| Auth | `/auth/register` | POST | Register user |
| Auth | `/auth/login` | POST | Login |
| Auth | `/auth/me` | GET | Get current user |
| Courses | `/courses` | GET | List courses |
| Courses | `/courses/:id/enroll` | POST | Enroll in course |
| Questions | `/questions/subjects` | GET | Get subjects |
| Questions | `/questions` | GET | Get questions |
| CBT | `/cbt/attempts` | POST | Start exam |
| CBT | `/cbt/attempts/:id/submit` | POST | Submit exam |
| AI | `/ai/chat` | POST | Chat with AI |
| AI | `/ai/questions` | POST | Generate questions |
| Analytics | `/analytics/stats` | GET | User stats |
| Analytics | `/analytics/leaderboard` | GET | Leaderboard |
| Payments | `/payments/plans` | GET | Get plans |
| Payments | `/payments/paystack` | POST | Initialize Paystack |
| Payments | `/payments/flutterwave` | POST | Initialize Flutterwave |

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://edumaster:password@localhost:5432/edumaster
JWT_SECRET=your-super-secret-key
OPENAI_API_KEY=sk-xxx
PAYSTACK_SECRET_KEY=sk-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:4000/api/v1
```

## Testing

```bash
# Backend tests
npm run test

# Run with coverage
npm run test -- --coverage
```

## Deployment

The backend is production-ready with:
- Docker containerization
- Multi-stage builds
- Helmet security headers
- Rate limiting ready (Redis)
- JWT authentication
- Input validation
- Swagger documentation