<div align="center">
<img width="1200" height="475" alt="OptiSchedule Pro Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OptiSchedule Pro

**Intelligent scheduling solution for Walmart store operations**

OptiSchedule Pro is a sophisticated workforce scheduling platform designed to optimize employee scheduling and correct misalignment in Walmart store operations. It leverages AI-powered insights to improve scheduling efficiency, reduce labor costs, and enhance operational performance across store networks.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Wbaker7702/OptiSchedule-Pro)](https://github.com/Wbaker7702/OptiSchedule-Pro/issues)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-blue)](CODE_OF_CONDUCT.md)

## 🌟 Features

### Core Capabilities
- **Intelligent Scheduling**: AI-driven workforce scheduling optimization
- **Real-time Analytics**: Live dashboard for store performance metrics
- **Automated Conflict Resolution**: Intelligent detection and resolution of scheduling conflicts
- **Multi-Store Management**: Centralized control across multiple store locations
- **Employee Portal**: Self-service scheduling interface for associates

### Enterprise Features
- **Advanced Reporting**: Comprehensive analytics and compliance reporting
- **Custom Integrations**: API-first architecture for seamless enterprise connectivity
- **Role-based Access Control**: Granular permission management
- **Audit Logging**: Complete audit trail for compliance
- **SSO/SAML Support**: Enterprise authentication integration
- **White-label Customization**: Branded deployment options

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Enterprise Edition](#enterprise-edition)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ or higher
- **npm**: v9+ or yarn v3+
- **Database**: PostgreSQL 12+ (for backend)
- **API Key**: Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wbaker7702/OptiSchedule-Pro.git
   cd OptiSchedule-Pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration:
   ```env
   # Frontend AI features (exposed in browser builds)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_ENVIRONMENT=development

   # Backend AI proxy (server only)
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Getting Started](docs/GETTING_STARTED.md)** - Initial setup and first steps
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and components
- **[API Documentation](docs/API.md)** - REST API reference
- **[Backend Setup](BACKEND_SETUP.md)** - Server configuration guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Enterprise Setup](docs/ENTERPRISE_SETUP.md)** - Enterprise edition configuration
- **[Security Guide](SECURITY.md)** - Security practices and reporting
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## ⚙️ Configuration

### Environment Variables

```env
# Frontend
VITE_GEMINI_API_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:3000
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=info

# Backend (see BACKEND_SETUP.md)
GOOGLE_GENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/optischedule
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

See `.env.example` for all available options.

## 🛠️ Development

### Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
```

### Project Structure

```
OptiSchedule-Pro/
├── components/          # React components
├── pages/              # Page components
├── services/           # API services
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application constants
├── validators.ts       # Input validation
├── App.tsx            # Root component
├── server.ts          # Backend server
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## 🏢 Enterprise Edition

OptiSchedule Pro Enterprise provides advanced features for large-scale deployments:

### Enterprise Features
- **Advanced RBAC**: Fine-grained role-based access control
- **API & Webhooks**: Full REST API with webhook support
- **Custom Reports**: Advanced analytics and custom reporting
- **SSO/SAML**: Enterprise authentication protocols
- **White-label**: Customizable branding and UI
- **Priority Support**: 24/7 dedicated support
- **SLA Guarantees**: Uptime and performance SLAs

### Getting Started with Enterprise

See **[Enterprise Setup Guide](docs/ENTERPRISE_SETUP.md)** for:
- Enterprise licensing
- Advanced configuration
- Custom integrations
- Deployment options
- Support channels

## 🔒 Security

Security is a top priority. Please review:

- **[Security Policy](SECURITY.md)** - Reporting security vulnerabilities
- **[Security Audit](SECURITY_AUDIT.md)** - Latest security assessment
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines

For reporting security issues, please email: security@optischedule-pro.dev

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) for details on:

- Code style and standards
- Commit message conventions
- Pull request process
- Development workflow

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: https://github.com/Wbaker7702/OptiSchedule-Pro/wiki
- **Issues**: https://github.com/Wbaker7702/OptiSchedule-Pro/issues
- **Discussions**: https://github.com/Wbaker7702/OptiSchedule-Pro/discussions
- **Enterprise Support**: enterprise@optischedule-pro.dev

## 🗺️ Roadmap

See our [Project Board](https://github.com/Wbaker7702/OptiSchedule-Pro/projects) for upcoming features and enhancements.

---

**Made with ❤️ for Walmart Store Operations**
