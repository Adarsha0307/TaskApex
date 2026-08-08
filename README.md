# TaskApex - Task Manager

A modern task management application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Simple Login**: User ID + Password authentication
- **Cross-Device Sessions**: JWT-based sessions that work across multiple devices
- **Task Management**: Add, complete, delete tasks with real-time updates
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Beautiful dark mode UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui compatible structure
- **Animations**: Framer Motion
- **3D Background**: React Three Fiber
- **Auth**: JWT with jose library
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd taskapex

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── route.ts          # Login/Register API
│   │   │   ├── logout/route.ts   # Logout API
│   │   │   └── session/route.ts  # Session check API
│   │   └── tasks/
│   │       ├── route.ts          # Tasks CRUD
│   │       └── [id]/route.ts     # Individual task operations
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard page (server)
│   │   └── dashboard-content.tsx # Dashboard content (client)
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home (redirects to login/dashboard)
├── components/
│   └── LoginForm.tsx             # Reusable login/register form
├── lib/
│   ├── auth.ts                   # JWT auth utilities
│   └── utils.ts                  # Utility functions (cn)
└── ...
```

## Authentication Flow

1. **Register**: Creates new user with hashed password (bcrypt)
2. **Login**: Verifies password, creates JWT session cookie
3. **Session**: JWT stored in httpOnly cookie (7-day expiry)
4. **Cross-Device**: Each device gets unique deviceId in session
5. **Logout**: Clears session cookie

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth` | Register or login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/session` | Check session |
| GET | `/api/tasks` | List user tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Environment Variables

Create `.env.local`:

```env
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
NODE_ENV=development
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `JWT_SECRET` environment variable
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Notes

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens in httpOnly, secure, sameSite cookies
- CSRF protection via sameSite cookies
- Input validation on all API endpoints
- Use HTTPS in production (set `NODE_ENV=production`)

## License

MIT