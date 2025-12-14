#!/bin/bash
# Production deployment checklist

set -e

echo "🚀 Production Deployment Checklist"
echo "=================================="
echo ""

# Check for required environment variables
echo "✓ Checking environment variables..."
required_vars=(
  "POSTGRES_PASSWORD"
  "JWT_SECRET"
  "SECRET_KEY_BASE"
  "POSTGRES_DB"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables:"
  printf '%s\n' "${missing_vars[@]}"
  exit 1
fi

echo "✓ All required environment variables are set"
echo ""

# Build images
echo "📦 Building Docker images..."
docker-compose build --no-cache

echo ""
echo "✓ Images built successfully"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose run --rm backend rails db:migrate

echo ""
echo "✓ Migrations completed"
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "✓ Services started"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "Services running:"
echo "  - Backend: http://localhost:${RAILS_PORT:-3000}"
echo "  - Frontend: http://localhost:${FRONTEND_PORT:-5173}"
echo "  - Database: localhost:${DB_PORT:-5432}"
echo ""
echo "View logs with: docker-compose logs -f"
