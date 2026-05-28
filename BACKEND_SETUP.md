# Backend Setup Guide

This guide explains how to set up and run the secure backend server for OptiSchedule-Pro.

## Overview

The backend provides:
- **Authentication API** (`/api/auth/login`, `/api/auth/logout`)
- **Chat API** (`/api/defender/chat`) - Secure proxy to Google GenAI
- **Session Management** - HTTP-only cookies, secure tokens
- **Rate Limiting** - Brute force protection, API abuse prevention
- **Input Validation & Sanitization** - Prevents injection attacks

## Architecture

```
Frontend (React)
    ↓
Browser (HTTP-only cookies)
    ↓
Backend (Node.js + Express)
    ├── Authentication Service
    ├── Session Manager
    ├── Rate Limiter
    └── Google GenAI Proxy
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google GenAI API key (free from https://ai.google.dev)

## Installation

### 1. Install Backend Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `bcrypt` - Password hashing
- `cookie-parser` - Cookie management
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `cors` - Cross-origin requests

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Frontend URL (CORS whitelist)
FRONTEND_URL=http://localhost:5173

# Server
NODE_ENV=development
PORT=3001

# Security
COOKIE_SECRET=your-min-32-character-random-secret-key-here

# Google GenAI API Key
GOOGLE_GENAI_API_KEY=your-api-key-from-ai.google.dev
```

### 3. Get Google GenAI API Key

1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new project
4. Generate API key
5. Copy to `.env` as `GOOGLE_GENAI_API_KEY`

## Running the Server

### Development Mode

```bash
npm run server
```

Output:
```
🔐 Secure Defender Portal Server running on http://localhost:3001
📝 Environment: development
🗝️ Session storage: In-Memory (use Redis in production)

Available endpoints:
  POST   /api/auth/login       - Authenticate user
  POST   /api/auth/logout      - Logout user
  POST   /api/defender/chat    - Send message to Gemini
  GET    /api/health           - Health check
  GET    /api/sessions         - List active sessions (admin only)
```

### Run Frontend + Backend Together

```bash
npm run dev:all
```

This opens two terminals:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

## API Endpoints

### POST /api/auth/login

Authenticates user and creates session.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@contoso.com",
    "password": "SecurePassword123!"
  }'
```

**Success Response (200):**
```json
{
  "message": "Authentication successful",
  "user": {
    "id": "uuid",
    "email": "user@contoso.com",
    "role": "user"
  }
}
```

Sets `HttpOnly` cookie:
```
Set-Cookie: session=token; HttpOnly; Secure; SameSite=Strict; Path=/
```

**Error Responses:**
- `400` - Invalid email/password format
- `401` - Invalid credentials
- `429` - Too many login attempts

### POST /api/auth/logout

Invalidates session and clears cookie.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Cookie: session=token"
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### POST /api/defender/chat

Sends message to Google GenAI Gemini model.

**Requires:** Valid session (HTTP-only cookie)

**Request:**
```bash
curl -X POST http://localhost:3001/api/defender/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: session=token" \
  -d '{
    "message": "How should I optimize staffing?",
    "history": [],
    "hubspotStatus": "connected"
  }'
```

**Success Response (200):**
```json
{
  "response": "Based on current metrics, I recommend...",
  "timestamp": "2026-05-15T22:10:54.000Z"
}
```

**Error Responses:**
- `400` - Invalid request or suspicious input
- `401` - Session expired
- `429` - Rate limit exceeded (30 req/min)
- `500` - API error

### GET /api/health

Health check for monitoring.

**Request:**
```bash
curl http://localhost:3001/api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-05-15T22:10:54.000Z",
  "uptime": 42.123
}
```

### GET /api/sessions (Admin Only)

Lists active sessions.

**Request:**
```bash
curl http://localhost:3001/api/sessions \
  -H "Cookie: session=admin-token"
```

**Response (200):**
```json
{
  "sessions": [
    {
      "userId": "uuid",
      "email": "user@contoso.com",
      "createdAt": "2026-05-15T22:10:54.000Z",
      "expiresAt": "2026-05-16T22:10:54.000Z"
    }
  ]
}
```

## Security Features

### ✅ Password Security
- Bcrypt hashing (cost factor 10)
- Constant-time comparison (prevents timing attacks)
- Minimum 12 characters required
- 1 uppercase, 1 lowercase, 1 number, 1 special character

### ✅ Session Management
- HTTP-only cookies (not accessible by JavaScript)
- Secure flag (HTTPS only in production)
- SameSite=Strict (CSRF protection)
- 24-hour expiration
- IP address validation (prevents session hijacking)
- User-Agent tracking

### ✅ Rate Limiting
- Login: 5 attempts per 15 minutes per IP+email
- Chat: 30 requests per minute per user
- Returns 429 status when exceeded
- Tracks attempts per IP address

### ✅ Input Validation
- Email format validation (RFC 5322)
- Message length limits (max 2000 chars)
- HTML escaping (prevents XSS)
- SQL injection pattern detection
- Suspicious input blocking

### ✅ Security Headers (Helmet.js)
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

### ✅ CORS Protection
- Whitelist frontend URL
- Credentials required
- Specific methods allowed
- Specific headers allowed

## Test Users

In development, use these test credentials:

| Email | Password | Role |
|-------|----------|------|
| user@contoso.com | SecurePassword123! | user |

Add more users to `server.ts` (lines 50-60) in mock database.

## Production Deployment

### Required Changes

Before deploying to production:

1. **Database**
   - Replace in-memory user storage with PostgreSQL/MongoDB
   - Store password hashes, never plaintext
   - Use prepared statements to prevent SQL injection

2. **Session Storage**
   - Replace in-memory sessions with Redis
   - Set expiration in Redis
   - Enable Redis persistence

3. **Environment**
   - Set `NODE_ENV=production`
   - Use strong `COOKIE_SECRET` (min 32 random chars)
   - Enable HTTPS on all routes
   - Use secure, HttpOnly, SameSite cookies

4. **Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Never commit API keys to Git
   - Rotate keys regularly

5. **Logging & Monitoring**
   - Use structured logging (JSON format)
   - Send logs to centralized system (ELK, Datadog, etc.)
   - Monitor rate limit events
   - Alert on suspicious activity

6. **Load Balancing**
   - Use sticky sessions or Redis-based session sharing
   - Rate limit at load balancer level
   - WAF (Web Application Firewall)

### Recommended Stack

```
Frontend (React/Vite) → Cloudflare
                         ↓
                    AWS API Gateway
                         ↓
                    Load Balancer (ELB)
                         ↓
                    Node.js Cluster (Horizontal Scaling)
                         ↓
                    Redis (Session Store)
                    PostgreSQL (User Database)
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Cookie Not Being Set

- Check `NODE_ENV=development` (in development, cookies work without HTTPS)
- Check browser console for cookie errors
- Verify CORS is allowing credentials: `credentials: 'include'`

### Rate Limit Too Strict

Adjust in `server.ts`:
```typescript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Change window
  max: 5, // Change max attempts
});
```

### Google GenAI API Errors

1. Verify API key is correct and not expired
2. Check API key has GenAI permissions
3. Check quota limits not exceeded
4. Review API error logs in Google Cloud Console

### CORS Errors

Verify `FRONTEND_URL` matches frontend origin exactly:
```
frontend URL: http://localhost:5173
CORS origin: http://localhost:5173
```

## Performance Optimization

### For Production

1. **Enable Compression**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Add Request Logging**
   ```typescript
   import morgan from 'morgan';
   app.use(morgan('combined'));
   ```

3. **Database Connection Pooling**
   - Use connection pools for PostgreSQL
   - Redis connection pooling
   - Monitor pool exhaustion

4. **Caching**
   - Cache Gemini responses (with TTL)
   - Cache user permissions
   - CDN for static assets

## Security Checklist

- [ ] Environment variables configured
- [ ] Google GenAI API key set
- [ ] Test login works
- [ ] Test chat works
- [ ] Rate limiting tested
- [ ] HTTPS enabled (production)
- [ ] Database configured (production)
- [ ] Redis configured (production)
- [ ] Logging configured
- [ ] Monitoring configured
- [ ] Backup strategy defined
- [ ] Incident response plan created

## Support

For issues:
1. Check server logs: `npm run server`
2. Test API endpoints with curl
3. Verify environment variables
4. Review backend code in `server.ts`
5. Check frontend API calls in `DefenderAssistant.tsx`

## References

- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Bcrypt Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Google GenAI API Docs](https://ai.google.dev/docs)
