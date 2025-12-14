# Docker Setup Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

## Environment Setup

### Development
```bash
cp .env.development .env
```

### Production
```bash
cp .env.example .env
# Edit .env with your production secrets
```

## Getting Started

### Development Mode
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This will:
- Build development images with hot-reload capabilities
- Start PostgreSQL database
- Automatically run database migrations and seeding
- Start Rails server with development configuration
- Start Vite dev server with hot module replacement

### Production Mode
```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with production values

# 2. Deploy using the script
bash deploy-production.sh
```

Or manually:
```bash
docker compose up --build -d
```

## Access Services

### Development
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Database**: localhost:5432

### Production
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com/api/v1
- **Database**: Use managed database service (not exposed)

## Common Commands

### Start/Stop Services
```bash
# Start in background
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Last 100 lines
docker compose logs --tail=100 backend
```

### Database Commands
```bash
# Run migrations
docker compose exec backend rails db:migrate

# Seed database
docker compose exec backend rails db:seed

# Reset database
docker compose exec backend rails db:drop db:create db:migrate db:seed

# Database console
docker compose exec db psql -U postgres -d wingmate_development
```

### Rails Commands
```bash
# Rails console
docker compose exec backend rails console

# Create migrations
docker compose exec backend rails generate migration CreateTable

# Run tests
docker compose exec backend rails test

# Check Rails routes
docker compose exec backend rails routes
```

### Frontend Commands
```bash
# Install dependencies
docker compose exec frontend npm install

# Build for production
docker compose exec frontend npm run build

# Lint code
docker compose exec frontend npm run lint
```

### Interactive Access
```bash
# Bash in backend
docker compose exec backend bash

# Shell in frontend
docker compose exec frontend sh

# Shell in database
docker compose exec db bash
```

## Health Checks

All production services include health checks. View status:
```bash
docker compose ps
```

Expected output:
```
NAME             STATUS
crm_db           Up (healthy)
crm_backend      Up (healthy)
crm_frontend     Up (healthy)
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker compose logs backend
docker compose logs db

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

### Database Connection Errors
1. Verify database is healthy: `docker compose ps`
2. Check environment variables: `docker compose config`
3. Test connection: `docker compose exec db psql -U postgres -d postgres -c '\q'`

### Port Already in Use
Change port mappings in docker-compose.yml:
```yaml
backend:
  ports:
    - "3001:3000"  # Use 3001 instead of 3000

frontend:
  ports:
    - "5174:5173"  # Use 5174 instead of 5173
```

### Out of Disk Space
```bash
# Remove unused images and volumes
docker system prune -a --volumes

# Clean up dangling images
docker image prune -a
```

### Gem Installation Issues
```bash
# Rebuild with fresh Gemfile.lock
docker compose down -v
docker compose build --no-cache
docker compose up
```

### Node Modules Issues
```bash
# Rebuild frontend
docker compose down
docker compose build --no-cache frontend
docker compose up frontend
```

## Performance Optimization

### For Development
- Enable Docker desktop resources: 4+ cores, 8GB+ RAM
- Use named volumes for better performance on Mac/Windows

### For Production
- Use Alpine-based images (already configured)
- Multi-stage builds for smaller final images
- Enable container restart policies
- Set resource limits in docker-compose.yml

## Security Best Practices

✅ **Already Implemented**
- Non-root user execution
- Health checks for automatic restart
- Restart policies for resilience
- No privilege escalation
- Environment variable secrets management

✅ **Additional Recommendations**
- Use HTTPS/SSL in production
- Use managed PostgreSQL (not containerized)
- Enable Docker Content Trust
- Regular security updates
- Monitor container logs
- Implement backup strategy

## Backup and Recovery

### Backup Database
```bash
docker compose exec db pg_dump -U postgres wingmate_production > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker compose exec -T db psql -U postgres wingmate_production
```

### Backup Volumes
```bash
docker run --rm -v crm_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

## Deployment Checklist

Before production deployment:
- [ ] Generate SECRET_KEY_BASE: `docker compose run --rm backend rails secret`
- [ ] Generate JWT_SECRET: `openssl rand -hex 32`
- [ ] Set all environment variables in .env
- [ ] Update DATABASE_URL to production database
- [ ] Set VITE_API_URL to production API endpoint
- [ ] Enable HTTPS/SSL
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Test disaster recovery
- [ ] Review security checklist

See PRODUCTION.md for detailed production setup instructions.
