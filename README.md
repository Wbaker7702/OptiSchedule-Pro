# OptiSchedule-pro 🗓️
> Enterprise-grade scheduling optimization powered by Constraint Logic and LLM Intent Extraction.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Version](https://img.shields.io/badge/version-1.0.0--pro-blue)

## 🏗️ Architecture Overview
OptiSchedule-pro is built for scale, utilizing a decoupled architecture to separate language processing from scheduling math.
- **Frontend:** React / Next.js
- **Backend:** Node.js / Python (FastAPI)
- **Data Layer:** PostgreSQL (Time-series optimized)
- **Cache/Queue:** Redis (for asynchronous optimization tasks)
- **AI:** OpenAI GPT-4o via Function Calling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) or Python 3.10+
- PostgreSQL 14+
- Redis 6+
- OpenAI API Key

### 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Wbaker7702/OptiSchedule-pro.git](https://github.com/Wbaker7702/OptiSchedule-pro.git)
   cd OptiSchedule-pro
   
