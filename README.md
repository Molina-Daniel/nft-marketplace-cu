# NFT Marketplace

A full-stack NFT marketplace with listing, buying, and compliance features built with Next.js, TypeScript, and Web3 technologies.

![NFT Marketplace](public/marketplace-home.png)

## Overview

This NFT Marketplace allows users to mint, list, and purchase NFTs in a decentralized environment. The platform includes features like:

- Compliance checking
- ERC-20 token payment support
- Blockchain events indexing
- Responsive user interface.

## Table of Contents

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Environment Variables](#environment-variables)
  - [Setup](#setup)
  - [Add Anvil to Metamask](#add-anvil-to-your-metamask)
  - [Add Anvil Accounts to Metamask](#add-anvil-accounts-to-your-metamask)
  - [Docker Setup](#docker-setup)
- [Running the Application](#running-the-application)
- [Database Reset](#database-reset)
- [Smart Contract Integration](#smart-contract-integration)
- [Compliance API](#compliance-api)
- [Testing Addresses](#addresses-for-testing)

## Technologies

### Frontend

- **Next.js 15**: React framework with App Router for server-side rendering and routing
- **React 19**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **Rainbow Kit 2**: Wallet connection components
- **Wagmi 2**: React hooks for Ethereum
- **Viem 2**: Low-level Ethereum interface

### Backend

- **Next.js API Routes**: Serverless functions for backend logic
- **Circle Compliance API**: Address screening for regulatory compliance
- **UUID**: Unique identifier generation

### Blockchain

- **Foundry/Anvil**: Ethereum development environment and local blockchain
- **Smart Contracts**: ERC-721 (NFT) and custom marketplace contracts
- **RIndexer**: Blockchain indexing solution

### DevOps

- **Docker**: Containerization for the indexer database
- **PostgreSQL**: Database for indexed blockchain data

## Project Structure

```
nft-marketplace-cu/
├── foundry/                 # Smart contract code and testing
├── marketplaceIndexer/      # Blockchain indexing configuration
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/             # API routes
│   │   │   └── compliance/  # Compliance API integration
│   │   ├── buy-nft/         # NFT purchasing pages
│   │   ├── cake-nft/        # NFT minting pages
│   │   ├── list-nft/        # NFT listing pages
│   ├── components/          # Reusable React components
│   │   ├── CakeNft.tsx      # NFT minting component
│   │   ├── Header.tsx       # Navigation header
│   │   ├── ListNftForm.tsx  # NFT listing form
│   │   ├── NFTBox.tsx       # NFT display component
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── constants.ts         # Contract ABIs and addresses
│   ├── utils/               # Utility functions
│   └── wagmiConfig.ts       # Wagmi configuration
```

## Features

- **NFT Minting**: Create new NFTs with the CakeNFT contract
- **NFT Listing**: List your NFTs for sale on the marketplace
- **NFT Buying**: Purchase NFTs that others have listed
- **Recently Listed NFTs**: View the most recent NFTs available for purchase
- **Address Compliance**: Integrated with Circle's compliance API to screen addresses
- **Wallet Integration**: Connect with MetaMask, Rainbow, and other wallets via WalletConnect
- **USDC Payment**: Support for ERC-20 token payments

## Getting Started

### Requirements

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Git**: v2.33.0 or higher
- **Foundry/Anvil**: v1.0.0-stable or higher
- **Docker**: v27.4.0 or higher
- **RIndexer**: v0.15.2 or higher

You can verify installations with:

```bash
node --version
pnpm --version
git --version
anvil --version
docker --version
rindexer --version
```

### Environment Variables

Create a .env.local file in the root directory with:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
CIRCLE_API_KEY=TEST_API_KEY
GRAPHQL_API_URL=http://localhost:3001/graphql
ENABLE_COMPLIANCE_CHECK=false
```

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `GRAPHQL_API_URL`: Points to your local indexer GraphQL endpoint
- `ENABLE_COMPLIANCE_CHECK`: Set to `true` to enable compliance checks
- `CIRCLE_API_KEY`: Get from [Circle Developer Portal](https://console.circle.com/api-keys)

### Setup

```bash
git clone https://github.com/Molina-Daniel/nft-marketplace-cu
cd nft-marketplace-cu
pnpm install
```

### Add Anvil to your Metamask

Add the following network to Metamask:

- Name: Anvil
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

### Add Anvil Accounts to your Metamask

Import these private keys to Metamask:

```
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
(9) 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
```

These accounts will have NFTs already loaded when you run `pnpm anvil`.

### Docker Setup

Create a `.env` file in marketplaceIndexer:

```
DATABASE_URL=postgresql://postgres:rindexer@localhost:5440/postgres
POSTGRES_PASSWORD=rindexer
```

## Running the Application

The application requires three components running in parallel:

```bash
pnpm anvil        # Local Ethereum blockchain
pnpm indexer      # Blockchain indexer
pnpm run dev      # Next.js application
```

After running `pnpm anvil`, switch to the imported Account 0 in Metamask and add this NFT:

```
0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

with tokenID 0.

## Database Reset

If you need to reset the indexer database:

```bash
pnpm run reset-indexer
```

This stops the indexer, removes the volume, and restarts it.

## Smart Contract Integration

The project integrates with several smart contracts:

- **ERC-721 NFTs**: Used for creating and managing non-fungible tokens
- **Marketplace Contract**: Handles listing, buying, and managing NFT sales
- **ERC-20 USDC**: Used as the payment token for NFT purchases

## Compliance API

The application includes a compliance check API endpoint that integrates with Circle's screening service. This is implemented in route.ts and can be enabled/disabled through environment variables.

The compliance API verifies wallet addresses against regulated entities and can prevent transactions from sanctioned addresses.

```typescript
// Example API call
const response = await fetch("/api/compliance", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ address: "0x..." }),
});
```

## Addresses for Testing

- USDC: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- NFT Marketplace: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Cake NFT: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- Mood NFT: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

These addresses are deployed on the local Anvil blockchain and can be used for testing the application's features.
