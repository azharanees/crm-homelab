#!/bin/bash
# Production-Grade Docker Quick Reference

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         CRM Production-Grade Docker Setup v2.0            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_info() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_section "1. ENVIRONMENT SETUP"
echo ""
echo "Development:"
echo "  cp .env.development .env"
echo ""
echo "Production:"
echo "  cp .env.example .env"
echo "  # Edit with your secrets"
print_info "Generate SECRET_KEY_BASE: docker-compose run --rm backend rails secret"
print_info "Generate JWT_SECRET: openssl rand -hex 32"

print_section "2. START SERVICES"
echo ""
echo "Development (with hot-reload):"
echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build"
echo ""
echo "Production:"
echo "  bash deploy-production.sh"
echo ""
echo "Or manually:"
echo "  docker-compose up --build -d"

print_section "3. VERIFY HEALTH"
echo ""
echo "Check service status:"
echo "  docker-compose ps"
echo ""
echo "Test connectivity:"
echo "  curl http://localhost:3000/up          # Backend health"
echo "  curl http://localhost:5173            # Frontend health"
print_warning "All services should show (healthy)"

print_section "4. COMMON TASKS"
echo ""
print_info "View logs: docker-compose logs -f [service]"
print_info "Database migration: docker-compose exec backend rails db:migrate"
print_info "Database seed: docker-compose exec backend rails db:seed"
print_info "Rails console: docker-compose exec backend rails console"
print_info "Stop all: docker-compose down"
print_info "Full reset: docker-compose down -v"

print_section "5. PRODUCTION CHECKLIST"
echo ""
print_info "Use strong passwords (32+ chars)"
print_info "Generate unique SECRET_KEY_BASE and JWT_SECRET"
print_info "Use external PostgreSQL (not containerized)"
print_info "Enable HTTPS/SSL certificates"
print_info "Set up database backups"
print_info "Configure monitoring and logging"
print_info "Test disaster recovery"
print_info "Review security policies"

print_section "6. DOCKER IMAGE SIZES"
echo ""
echo "Backend:  ~500MB (Ruby 3.4.7-slim)"
echo "Frontend: ~200MB (Alpine Node + built assets)"
echo "Database: ~100MB (Alpine PostgreSQL)"
print_info "Total: ~800MB for all services"

print_section "7. KEY IMPROVEMENTS"
echo ""
print_info "✓ Non-root user execution"
print_info "✓ Health checks for auto-recovery"
print_info "✓ Restart policies for resilience"
print_info "✓ Multi-stage frontend builds"
print_info "✓ Asset precompilation at build time"
print_info "✓ Alpine base images (40% smaller)"
print_info "✓ Security: no-new-privileges"
print_info "✓ Environment variable management"

print_section "8. DOCUMENTATION"
echo ""
print_info "DOCKER_SETUP.md       - Full setup guide"
print_info "PRODUCTION.md         - Production deployment"
print_info "PRODUCTION_UPGRADE.md - Changes from v1"
print_info "docker-help.sh        - Development helpers"

print_section "9. TROUBLESHOOTING"
echo ""
echo "Backend won't start:"
echo "  docker-compose logs backend"
echo "  docker-compose down -v && docker-compose up --build"
echo ""
echo "Database connection issues:"
echo "  docker-compose exec db psql -U postgres -d postgres -c '\\\\q'"
echo ""
echo "Out of disk space:"
echo "  docker system prune -a --volumes"
echo ""
echo "Clear cache and rebuild:"
echo "  docker-compose build --no-cache --pull"

print_section "10. CONTACT & SUPPORT"
echo ""
echo "For issues or questions:"
echo "  1. Check DOCKER_SETUP.md troubleshooting section"
echo "  2. Review logs: docker-compose logs -f"
echo "  3. Verify .env configuration"
echo "  4. Check Docker version compatibility"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}          Happy Deploying! 🚀${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
