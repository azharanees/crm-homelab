#!/bin/bash
# Helper script for Docker operations

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function print_usage() {
  echo "CRM Docker Helper Script"
  echo ""
  echo "Usage: ./docker-help.sh [command]"
  echo ""
  echo "Commands:"
  echo "  up              - Start all services"
  echo "  down            - Stop all services"
  echo "  restart         - Restart all services"
  echo "  rebuild         - Rebuild and start all services"
  echo "  logs            - View logs from all services"
  echo "  logs-backend    - View backend logs"
  echo "  logs-frontend   - View frontend logs"
  echo "  logs-db         - View database logs"
  echo "  console         - Rails console"
  echo "  migrate         - Run database migrations"
  echo "  seed            - Seed the database"
  echo "  reset-db        - Reset database (drops and recreates)"
  echo "  clean           - Remove containers and volumes"
  echo "  bash-backend    - Open bash in backend container"
  echo "  bash-frontend   - Open bash in frontend container"
  echo ""
}

case "${1:-help}" in
  up)
    echo "Starting services..."
    docker-compose up -d
    echo "✓ Services started"
    echo "Frontend: http://localhost:5173"
    echo "Backend:  http://localhost:3000/api/v1"
    ;;
  down)
    echo "Stopping services..."
    docker-compose down
    echo "✓ Services stopped"
    ;;
  restart)
    echo "Restarting services..."
    docker-compose restart
    echo "✓ Services restarted"
    ;;
  rebuild)
    echo "Rebuilding and starting services..."
    docker-compose up --build -d
    echo "✓ Services rebuilt and started"
    ;;
  logs)
    docker-compose logs -f
    ;;
  logs-backend)
    docker-compose logs -f backend
    ;;
  logs-frontend)
    docker-compose logs -f frontend
    ;;
  logs-db)
    docker-compose logs -f db
    ;;
  console)
    echo "Opening Rails console..."
    docker-compose exec backend rails console
    ;;
  migrate)
    echo "Running migrations..."
    docker-compose exec backend rails db:migrate
    echo "✓ Migrations complete"
    ;;
  seed)
    echo "Seeding database..."
    docker-compose exec backend rails db:seed
    echo "✓ Database seeded"
    ;;
  reset-db)
    echo "Resetting database..."
    docker-compose exec backend rails db:drop db:create db:migrate db:seed
    echo "✓ Database reset"
    ;;
  clean)
    echo "Cleaning up containers and volumes..."
    docker-compose down -v
    echo "✓ Cleanup complete"
    ;;
  bash-backend)
    docker-compose exec backend bash
    ;;
  bash-frontend)
    docker-compose exec frontend sh
    ;;
  help|*)
    print_usage
    ;;
esac
