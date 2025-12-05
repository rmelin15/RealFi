# RealFi Network

> **Own the Real Economy** — Turn real-world infrastructure, machines, and contracts into programmable, investable assets.

![RealFi Network](https://images.unsplash.com/photo-1560472355-536de3962603?w=1200)

## 🌟 Overview

RealFi Network is a comprehensive platform for tokenizing and investing in real-world assets (RWA). From coffee shops to GPU clusters, solar arrays to mobility fleets — RealFi enables fractional ownership and yield generation from tangible infrastructure.

### Key Features

- **🏢 Direct Investment (Tier 1)**: Invest in tokenized real-world assets like coffee shops, car washes, GPU clusters, and solar plants
- **💻 Lend & Earn (Tier 2)**: Supply your hardware assets (GPUs, vehicles, solar panels) to earning networks
- **🔮 Coming Soon (Tier 3)**: Tokenized royalties, municipal projects, and ESG reward programs
- **⛓️ On-Chain Ownership**: ERC-20 tokens representing fractional ownership with full transferability
- **📊 Portfolio Management**: Track investments, yields, and performance across all asset classes

## 🏗️ Architecture

```
realfi-network/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── modules/  # Feature modules (auth, assets, offerings, etc.)
│   │   └── prisma/   # Database schema and migrations
│   └── prisma/
├── frontend/         # Next.js 14 application
│   └── src/
│       ├── app/      # App router pages
│       ├── components/
│       └── lib/      # Utilities and API client
├── contracts/        # Solidity smart contracts
│   └── src/
│       ├── RealFiAssetToken.sol
│       └── OfferingRegistry.sol
└── infra/           # Docker and environment config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/realfi-network.git
cd realfi-network

# Install root dependencies
npm install

# Install all workspace dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd contracts && npm install && cd ..
```

### 2. Environment Setup

```bash
# Copy environment template
cp infra/env.template infra/.env

# Update the .env file with your configuration
# Key variables:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET: Secret for JWT signing
# - BLOCKCHAIN_RPC_URL: EVM RPC endpoint
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL, Redis, and MinIO
npm run docker:up

# Or manually with Docker Compose
docker-compose -f infra/docker-compose.yml up -d
```

### 4. Database Setup

```bash
# Run Prisma migrations
cd backend
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

### 5. Start Development Servers

```bash
# From root directory - starts both backend and frontend
npm run dev

# Or start individually:
# Backend (port 3001)
cd backend && npm run start:dev

# Frontend (port 3000)
cd frontend && npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/api/docs (Swagger)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@realfi.network | Password123! |
| Investor | investor@example.com | Password123! |
| Operator | operator@example.com | Password123! |
| Issuer | issuer@example.com | Password123! |

## 📦 Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Auth**: JWT with Passport.js
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Web3**: wagmi + viem

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Standards**: ERC-20 (OpenZeppelin)
- **Network**: Polygon Amoy (testnet)

## 📊 Data Model

### Core Entities

```
User
├── Organizations (many-to-many)
├── Subscriptions (investments)
├── LendableAssets (owned)
└── RewardEvents (earned)

RealFiAsset (Tier 1)
├── Offerings
│   └── Subscriptions
├── PayoutEvents
└── TokenAddress (on-chain)

LendableAsset (Tier 2)
├── Owner (User)
├── Operator (Organization)
└── PerformanceRecords
```

## 🔗 Smart Contracts

### RealFiAssetToken
ERC-20 token representing fractional ownership in a specific asset.

```solidity
// Key functions
mint(address to, uint256 amount)      // Mint tokens to investors
batchMint(address[], uint256[])       // Batch mint on offering close
finalizeMinting()                     // Lock supply after allocation
pause() / unpause()                   // Emergency controls
```

### OfferingRegistry
Central registry mapping off-chain assets to on-chain tokens.

```solidity
// Key functions
deployAssetToken(...)                 // Deploy new asset token
getTokenAddress(string assetId)       // Get token for asset
isAssetRegistered(string assetId)     // Check registration
```

### Deploying Contracts

```bash
cd contracts

# Compile
npx hardhat compile

# Test
npx hardhat test

# Deploy to local
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.ts --network amoy
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Current user profile

### Assets (Tier 1)
- `GET /api/assets` - List assets
- `GET /api/assets/:id` - Asset details
- `POST /api/assets` - Create asset (Issuer)
- `POST /api/assets/:id/approve` - Approve asset (Admin)

### Offerings
- `GET /api/offerings` - List offerings
- `POST /api/offerings/:id/subscribe` - Invest in offering

### Lendable Assets (Tier 2)
- `GET /api/lendable-assets` - List lendable assets
- `POST /api/lendable-assets` - Create listing
- `POST /api/lendable-assets/:id/performance` - Add metrics

### Portfolio
- `GET /api/portfolio` - Portfolio summary
- `GET /api/portfolio/positions` - Investment positions
- `GET /api/portfolio/rewards` - Reward balance

## 🛠️ Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Contract tests
cd contracts && npx hardhat test

# Frontend (if implemented)
cd frontend && npm test
```

### Database Commands

```bash
cd backend

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run typecheck
```

## 🔒 Security Considerations

- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- KYC status verification for investments
- Rate limiting on API endpoints
- Input validation with class-validator
- Pausable contracts for emergencies

## 🗺️ Roadmap

### Phase 1 (MVP) ✅
- [x] User authentication and authorization
- [x] Tier 1 asset management and offerings
- [x] Tier 2 lendable assets marketplace
- [x] Portfolio dashboard
- [x] Smart contracts for tokenization

### Phase 2 (Coming Soon)
- [ ] Real payment gateway integration
- [ ] KYC provider integration (Sumsub/Onfido)
- [ ] On-chain yield distribution
- [ ] Mobile app

### Phase 3 (Future)
- [ ] Tokenized royalties marketplace
- [ ] Municipal project investments
- [ ] ESG reward programs
- [ ] Multi-chain support

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📧 Contact

- **Website**: https://realfi.network
- **Twitter**: @RealFiNetwork
- **Discord**: discord.gg/realfi
- **Email**: hello@realfi.network

---

<p align="center">
  <strong>RealFi Network</strong> — Own the Real Economy
</p>


















#   R e a l F i  
 