# Production Configuration Guide

## Production Requirements

Before deploying to production, ensure you have:

1. **Security**
   - Generate a strong `SECRET_KEY_BASE`:
     ```bash
     docker-compose run --rm backend rails secret
     ```
   - Generate a strong `JWT_SECRET`:
     ```bash
     openssl rand -hex 32
     ```
   - Use environment variables for all secrets (never commit to git)

2. **Database**
   - Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.) in production
   - Do NOT use containerized database in production
   - Set up automated backups
   - Use strong passwords for database

3. **SSL/TLS**
   - Use HTTPS in production
   - Set up SSL certificates (Let's Encrypt recommended)
   - Update VITE_API_URL to use https://

4. **Monitoring & Logging**
   - Set up centralized logging (CloudWatch, DataDog, etc.)
   - Monitor application performance and errors
   - Set up alerts for critical issues

5. **Performance**
   - Use production-grade web server (not Rails default)
   - Set up load balancing if needed
   - Enable caching strategies

## Environment Setup

Create a `.env.production` file with:

```bash
RAILS_ENV=production
SECRET_KEY_BASE=<your-generated-secret>
JWT_SECRET=<your-generated-jwt-secret>
DATABASE_URL=postgresql://user:password@your-prod-db:5432/database
POSTGRES_PASSWORD=<your-db-password>
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Deployment Steps

1. **Prepare environment file**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build and deploy**
   ```bash
   bash deploy-production.sh
   ```

3. **Verify deployment**
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

## Scaling Considerations

- Use Docker Swarm or Kubernetes for orchestration
- Set up database connection pooling
- Implement caching layer (Redis)
- Use CDN for static assets
- Monitor and optimize slow queries

## Security Best Practices

✓ Run containers as non-root user (already configured)
✓ Use health checks (already configured)
✓ Set restart policies (already configured)
✓ Disable privilege escalation (already configured)
✓ Use environment variables for secrets
✓ Keep base images updated
✓ Regular security audits
✓ Enable CORS properly for your domain
✓ Use strong database passwords
✓ Backup critical data regularly

## Maintenance

- Monitor container logs regularly
- Update base images monthly
- Test disaster recovery procedures
- Review and update security policies
- Monitor resource usage (CPU, memory, disk)
