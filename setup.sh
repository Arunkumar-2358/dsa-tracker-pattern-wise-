#!/usr/bin/env bash
set -e

echo ""
echo "🚀 DSA Tracker — Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Backend
echo "📦 Installing backend dependencies..."
cd "$ROOT/backend"
npm install

echo ""
echo "📋 Copying .env template..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ✅ Created backend/.env — fill in your values"
else
  echo "   ⚠️  backend/.env already exists — skipping"
fi

# Frontend
echo ""
echo "📦 Installing frontend dependencies..."
cd "$ROOT/frontend"
npm install

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Dependencies installed!"
echo ""
echo "Next steps:"
echo ""
echo "  1. Edit backend/.env with your database and Google OAuth credentials"
echo ""
echo "  2. Run database migrations:"
echo "     cd backend && npx prisma migrate dev --name init"
echo ""
echo "  3. Seed the database (loads all 290+ problems):"
echo "     cd backend && npm run db:seed"
echo ""
echo "  4. Start the servers:"
echo "     Backend:  cd backend && npm run dev"
echo "     Frontend: cd frontend && npm run dev"
echo ""
echo "  5. Open http://localhost:5173"
echo ""
