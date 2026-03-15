# Rapid Response Network

A civic-action platform where people can find or register rapid response groups in their area, featuring an interactive map of the United States and a secure admin backend for approving submissions.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth (email/password)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Map**: React Leaflet (OpenStreetMap)
- **Geocoding**: Nominatim (free, no API key)
- **Hosting**: Optimized for Railway

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Railway)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and a random auth secret.

3. **Set up the database:**
   ```bash
   npm run db:push
   ```

4. **Create an admin user:**
   ```bash
   npm run db:create-admin -- admin@example.com yourpassword "Admin Name"
   ```

5. **(Optional) Seed sample data:**
   ```bash
   npm run db:seed
   ```

6. **Start the dev server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Pages

| Page | Path | Description |
|------|------|-------------|
| Map / Home | `/` | Interactive map with approved group pins |
| Submit Group | `/submit` | Public form to register a new group |
| About | `/about` | Info about the network and FAQ |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | Manage submissions (approve/reject/edit) |
| Edit Group | `/admin/groups/[id]` | Edit group details |

## Railway Deployment

1. Create a new Railway project
2. Add a PostgreSQL service
3. Connect your GitHub repo — Railway auto-detects Next.js
4. Set environment variables in the Railway dashboard:
   - `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — your Railway app URL
   - `DATABASE_URL` — auto-injected by Railway
5. Railway runs `npm run build` which auto-generates the Prisma client
6. After first deploy, run `npm run db:push` and `npm run db:create-admin` via Railway CLI

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed sample data |
| `npm run db:create-admin` | Create admin user |

## License

MIT
