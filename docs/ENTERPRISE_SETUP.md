# OptiSchedule Pro - Enterprise Edition Setup Guide

## Overview

OptiSchedule Pro Enterprise is a comprehensive workforce scheduling solution designed for large-scale Walmart store operations. This guide covers enterprise-specific setup, configuration, and deployment.

## Enterprise Features

### Core Features
✅ Advanced Role-Based Access Control (RBAC)  
✅ REST API with OAuth2 Authentication  
✅ Webhook Support for Real-time Events  
✅ Custom Advanced Reporting  
✅ SSO/SAML Enterprise Authentication  
✅ White-label Customization  
✅ Comprehensive Audit Logging  
✅ Multi-Tenant Support  
✅ High Availability Clustering  
✅ SLA Guarantees (99.9% uptime)  
✅ 24/7 Priority Support  

## System Requirements

### Minimum Requirements
- **CPU**: 8 cores (production recommended 16+)
- **RAM**: 16 GB (production recommended 32+ GB)
- **Storage**: 500 GB SSD (production recommended 1+ TB)
- **Network**: 1 Gbps connection

### Software Requirements
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: 12.0 or higher
- **Redis**: 6.0 or higher (optional, for caching)
- **Docker**: v20.10+ (for containerized deployment)
- **Kubernetes**: v1.20+ (for orchestration)

### Supported Operating Systems
- Ubuntu 20.04 LTS or higher
- CentOS 7 or higher
- RHEL 7 or higher
- Windows Server 2019 or higher

## Installation Methods

### Option 1: Docker Compose (Recommended for Quick Setup)

```bash
# Clone repository
git clone https://github.com/Wbaker7702/OptiSchedule-Pro.git
cd OptiSchedule-Pro

# Create docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: optischedule_prod
      POSTGRES_USER: optischedule
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://optischedule:${DB_PASSWORD}@postgres:5432/optischedule_prod
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    environment:
      VITE_API_BASE_URL: http://localhost:3000
      VITE_GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
EOF

# Create .env file
cat > .env << 'EOF'
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
EOF

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Initialize database
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

### Option 2: Kubernetes Deployment (Production)

```bash
# Create namespace
kubectl create namespace optischedule-prod

# Create ConfigMap for application configuration
kubectl create configmap optischedule-config \
  --from-literal=NODE_ENV=production \
  --from-literal=LOG_LEVEL=info \
  -n optischedule-prod

# Create Secret for sensitive data
kubectl create secret generic optischedule-secrets \
  --from-literal=DB_PASSWORD=your_secure_password \
  --from-literal=JWT_SECRET=your_jwt_secret \
  --from-literal=GEMINI_API_KEY=your_api_key \
  -n optischedule-prod

# Deploy using provided manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get pods -n optischedule-prod
kubectl get svc -n optischedule-prod
```

See `k8s/` directory for complete Kubernetes manifests.

### Option 3: Manual Installation

```bash
# 1. Install Node.js dependencies
npm install

# 2. Install PostgreSQL
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 3. Install Redis
sudo apt-get install redis-server

# 4. Configure PostgreSQL
sudo -u postgres createdb optischedule_prod
sudo -u postgres createuser optischedule
sudo -u postgres psql -c "ALTER USER optischedule WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE optischedule_prod TO optischedule;"

# 5. Run database migrations
npm run migrate

# 6. Start services
npm run start:backend &
npm run start:frontend &
```

## Environment Configuration

### Backend Configuration

Create or update `.env` file:

```env
# Environment
NODE_ENV=production
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://optischedule:password@localhost:5432/optischedule_prod
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000

# Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis_password
CACHE_TTL=3600

# Authentication
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRY=86400
REFRESH_TOKEN_EXPIRY=2592000

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro

# Server
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=https://your-domain.com

# Enterprise Features
ENABLE_SSO=true
ENABLE_WEBHOOKS=true
ENABLE_ADVANCED_REPORTING=true

# SSO/SAML Configuration
SAML_ENTRY_POINT=https://your-idp.com/sso
SAML_ISSUER=optischedule-pro
SAML_CERT=path/to/cert.pem
SAML_PRIVATE_KEY=path/to/private-key.pem

# OAuth2
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=https://your-domain.com/auth/callback

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=no-reply@optischedule-pro.com

# Webhooks
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_TIMEOUT=5000

# Monitoring
SENTRY_DSN=https://key@sentry.io/project-id
DATADOG_API_KEY=your_datadog_key

# Security
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000
ENABLE_HELMET=true
ENABLE_HPP=true
```

### Frontend Configuration

```env
# API
VITE_API_BASE_URL=https://api.your-domain.com
VITE_API_TIMEOUT=30000

# Features
VITE_ENABLE_ADVANCED_FEATURES=true
VITE_ENABLE_ANALYTICS=true

# Authentication
VITE_AUTH_PROVIDER=sso
VITE_SSO_ENDPOINT=https://your-sso-provider.com

# Gemini
VITE_GEMINI_API_KEY=your_gemini_api_key

# Environment
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=warn
```

## Authentication Setup

### SSO/SAML Configuration

```typescript
// saml-config.ts
export const samlConfig = {
  entryPoint: process.env.SAML_ENTRY_POINT,
  issuer: process.env.SAML_ISSUER,
  cert: fs.readFileSync(process.env.SAML_CERT, 'utf-8'),
  privateKey: fs.readFileSync(process.env.SAML_PRIVATE_KEY, 'utf-8'),
  identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  assertionConsumerServiceUrl: `${process.env.APP_URL}/auth/saml/callback`,
  logoutUrl: `${process.env.SAML_ENTRY_POINT}/logout`,
};
```

### OAuth2 Configuration

```typescript
// oauth-config.ts
export const oauthConfig = {
  clientID: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackURL: process.env.OAUTH_REDIRECT_URI,
  authorizationURL: 'https://your-oauth-provider.com/oauth/authorize',
  tokenURL: 'https://your-oauth-provider.com/oauth/token',
  userInfoURL: 'https://your-oauth-provider.com/oauth/userinfo',
};
```

## Advanced Features

### Webhooks Setup

```bash
# Register webhook endpoint
curl -X POST https://api.your-domain.com/api/v1/webhooks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-system.com/webhooks/optischedule",
    "events": [
      "schedule.created",
      "schedule.updated",
      "schedule.optimized",
      "employee.added",
      "employee.updated",
      "report.generated"
    ],
    "secret": "your_webhook_secret_key",
    "retryPolicy": {
      "maxAttempts": 3,
      "backoffMultiplier": 2
    }
  }'
```

### Custom Reporting

```typescript
// Define custom report
const customReport = {
  id: 'custom_labor_report',
  name: 'Weekly Labor Analysis',
  description: 'Analyze labor costs and utilization',
  metrics: [
    'totalHours',
    'payrollCost',
    'utilizationRate',
    'overtimeHours',
    'coveragePercentage'
  ],
  filters: ['storeId', 'dateRange', 'department'],
  schedule: 'weekly', // or 'daily', 'monthly'
};
```

### White-label Configuration

```json
{
  "branding": {
    "appName": "Your Company Scheduler",
    "logo": "https://your-domain.com/logo.png",
    "favicon": "https://your-domain.com/favicon.ico",
    "primaryColor": "#1E40AF",
    "secondaryColor": "#0F172A",
    "fontFamily": "Inter, sans-serif"
  },
  "urls": {
    "supportUrl": "https://support.your-domain.com",
    "documentationUrl": "https://docs.your-domain.com",
    "privacyUrl": "https://your-domain.com/privacy",
    "termsUrl": "https://your-domain.com/terms"
  },
  "features": {
    "showPoweredBy": false,
    "enableUserRegistration": false,
    "enablePublicAPI": true
  }
}
```

## Production Deployment Checklist

- [ ] All environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Database backups configured and tested
- [ ] Redis persistence enabled
- [ ] Firewall rules configured
- [ ] Load balancer setup and health checks
- [ ] CDN configured for static assets
- [ ] Email service configured
- [ ] Monitoring and alerting setup
- [ ] Logging aggregation enabled
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Load testing completed
- [ ] User acceptance testing completed

## Monitoring & Support

### Health Check Endpoint

```bash
curl https://api.your-domain.com/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-05-17T16:00:00Z"
}
```

### Enterprise Support

For enterprise customers:
- **Phone**: +1-800-OPTISCHED
- **Email**: enterprise-support@optischedule-pro.com
- **Portal**: https://support.optischedule-pro.com
- **Status Page**: https://status.optischedule-pro.com

## Upgrading

```bash
# Backup current database
npm run backup:database

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npm run migrate

# Restart services
docker-compose restart
# or
systemctl restart optischedule
```

## Troubleshooting

### High Memory Usage
```bash
# Check for memory leaks
npm run profile:memory

# Adjust Node.js heap
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Database Connection Issues
```bash
# Test database connection
npm run test:database

# Check connection pool
psql -U optischedule -d optischedule_prod -c "SELECT count(*) FROM pg_stat_activity;"
```

### Performance Issues
```bash
# Enable query logging
DEBUG=* npm start

# Check slow queries
npm run analyze:queries
```

---

For more information:
- [Getting Started](GETTING_STARTED.md)
- [Architecture](ARCHITECTURE.md)
- [API Documentation](API.md)
- [Security Guide](../SECURITY.md)
