# Getting Started with OptiSchedule Pro

Welcome to OptiSchedule Pro! This guide will help you set up and start using the application in minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: v2.30.0 or higher ([Download](https://git-scm.com/))
- **Gemini API Key**: Get one from [Google AI Studio](https://ai.google.dev/)

Verify your installations:
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Should be v2.30+
```

## 🚀 Quick Setup (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Wbaker7702/OptiSchedule-Pro.git
cd OptiSchedule-Pro
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json`.

### Step 3: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=info
GOOGLE_GENAI_API_KEY=your_actual_gemini_api_key_here
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see output like:
```
Local:   http://localhost:5173/
```

### Step 5: Open in Browser

Navigate to `http://localhost:5173` and you should see the OptiSchedule Pro dashboard!

## 📁 Project Structure

```
OptiSchedule-Pro/
│
├── components/              # Reusable React components
│   ├── ScheduleGrid/       # Schedule visualization
│   ├── EmployeeManager/    # Employee management
│   └── Reports/            # Reporting components
│
├── pages/                   # Page components
│   ├── Dashboard/          # Main dashboard
│   ├── Schedules/          # Schedule management
│   └── Settings/           # User settings
│
├── services/                # API service layer
│   ├── api.ts              # API client
│   ├── schedule.ts         # Schedule operations
│   └── employee.ts         # Employee operations
│
├── types.ts                # TypeScript interfaces
├── constants.ts            # Application constants
├── validators.ts           # Form validation
├── App.tsx                 # Root component
├── server.ts               # Backend server (if using)
├── index.tsx               # Application entry point
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 💻 Available Commands

### Development
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run lint             # Run ESLint (code style check)
npm run type-check       # Run TypeScript type checking
```

### Testing
```bash
npm test                 # Run test suite once
npm run test:watch       # Run tests in watch mode
```

## 🔑 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Browser-exposed Gemini API key for frontend AI features | `AIza...` |
| `GOOGLE_GENAI_API_KEY` | Server-only Gemini API key for backend AI proxy endpoints | `AIza...` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_ENVIRONMENT` | Environment (development/production) | `development` |
| `VITE_LOG_LEVEL` | Logging level (debug/info/warn/error) | `info` |

See `.env.example` for additional options.

## 🎯 First Tasks

### 1. View Dashboard
The main dashboard shows:
- Store schedules overview
- Employee availability
- Scheduling alerts
- Performance metrics

### 2. Create a Schedule
1. Navigate to "Schedules"
2. Click "New Schedule"
3. Select date range
4. Add employees and shifts
5. Save

### 3. Generate Reports
1. Go to "Reports"
2. Select report type (coverage, utilization, compliance)
3. Set date range
4. Click "Generate"

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3001
```

### Issue: API key not working
1. Verify key is correct in `.env.local`
2. Check API key has correct permissions in Google AI Studio
3. Ensure no extra spaces around the key

### Issue: Dependencies not installing
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
```bash
# Rebuild TypeScript
npm run type-check
```

## 📚 Next Steps

- Read the [Architecture Guide](ARCHITECTURE.md) to understand the system
- Check the [API Documentation](API.md) for backend integration
- Review [BACKEND_SETUP.md](../BACKEND_SETUP.md) for server configuration
- Explore [Enterprise Setup](ENTERPRISE_SETUP.md) for advanced features

## ❓ FAQ

**Q: Can I use this with other API providers?**
A: The current implementation uses Gemini API. See ARCHITECTURE.md for integration points.

**Q: How do I set up the backend server?**
A: Follow the [Backend Setup Guide](../BACKEND_SETUP.md).

**Q: Is there a production deployment guide?**
A: Yes, see [Deployment Guide](DEPLOYMENT.md).

**Q: What's included in Enterprise?**
A: See [Enterprise Setup](ENTERPRISE_SETUP.md) for full feature list.

## 🆘 Getting Help

- 📖 **Documentation**: Check the `/docs` directory
- 🐛 **Issues**: [GitHub Issues](https://github.com/Wbaker7702/OptiSchedule-Pro/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Wbaker7702/OptiSchedule-Pro/discussions)
- 📧 **Contact**: For enterprise support, email enterprise@optischedule-pro.dev

---

**Happy scheduling! 🎯**
