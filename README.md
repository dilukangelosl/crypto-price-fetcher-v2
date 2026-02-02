# crypto-price-fetcher-v2

[![npm version](https://img.shields.io/npm/v/crypto-price-fetcher-v2.svg)](https://www.npmjs.com/package/crypto-price-fetcher-v2)
[![npm downloads](https://img.shields.io/npm/dm/crypto-price-fetcher-v2.svg)](https://www.npmjs.com/package/crypto-price-fetcher-v2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fetch real-time cryptocurrency prices directly from DEX pools via public RPCs. **No API keys required.**

## Features

- 🔗 **On-chain prices** - Fetches directly from Uniswap V3, PancakeSwap V3, and DexScreener
- ⚡ **Fast & lightweight** - Single dependency (viem)
- 🔒 **No API keys** - Uses public RPCs
- 📦 **TypeScript first** - Full type definitions included

## Supported Chains

| Chain | Token | Source |
|-------|-------|--------|
| Ethereum | ETH | Uniswap V3 Quoter |
| BSC | BNB | PancakeSwap V3 Quoter |
| Base | ETH | Uniswap V3 Quoter |
| Solana | SOL | DexScreener API |

## Installation

```bash
npm install crypto-price-fetcher-v2
# or
yarn add crypto-price-fetcher-v2
# or
bun add crypto-price-fetcher-v2
```

## Quick Start

```typescript
import { getETHPrice, getBNBPrice, getSOLPrice, getAllPrices } from 'crypto-price-fetcher-v2';

// Get individual prices
const ethPrice = await getETHPrice();
console.log(`ETH: $${ethPrice}`);

const bnbPrice = await getBNBPrice();
console.log(`BNB: $${bnbPrice}`);

const solPrice = await getSOLPrice();
console.log(`SOL: $${solPrice}`);

// Get all prices at once
const prices = await getAllPrices();
console.log(prices);
```

## API Reference

### Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getETHPrice(options?)` | `Promise<number>` | ETH price in USD (Ethereum) |
| `getBNBPrice(options?)` | `Promise<number>` | BNB price in USD (BSC) |
| `getSOLPrice()` | `Promise<number>` | SOL price in USD (Solana) |
| `getBaseETHPrice(options?)` | `Promise<number>` | ETH price in USD (Base) |
| `getPrice(chain, options?)` | `Promise<PriceResult>` | Price for specific chain |
| `getAllPrices(options?)` | `Promise<Record<ChainId, PriceResult>>` | All chain prices |

### Custom RPC URLs

```typescript
import { getETHPrice, getAllPrices } from 'crypto-price-fetcher-v2';

// Use your own RPC for better reliability
const ethPrice = await getETHPrice({
    rpcUrls: {
        ethereum: 'https://your-ethereum-rpc.com',
    }
});

// Custom RPCs for all chains
const prices = await getAllPrices({
    rpcUrls: {
        ethereum: 'https://your-eth-rpc.com',
        bsc: 'https://your-bsc-rpc.com',
        base: 'https://your-base-rpc.com',
    }
});
```

### Types

```typescript
type ChainId = 'ethereum' | 'bsc' | 'base' | 'solana';

interface PriceResult {
    chain: ChainId;
    symbol: string;
    price: number;
    timestamp: number;
}

interface FetchOptions {
    rpcUrls?: Partial<Record<ChainId, string>>;
    chainConfigs?: Partial<Record<ChainId, Partial<ChainConfig>>>;
}
```

## How It Works

- **EVM Chains**: Uses on-chain Quoter V2 contracts (Uniswap/PancakeSwap) to simulate swaps and get real-time prices
- **Solana**: Uses DexScreener's aggregated API which sources data from on-chain DEXes

## Changelog

### v1.0.5
- Fixed `exports` mapping in `package.json` to correctly resolve imports

### v1.0.4
- Improved dependency management
- Updated documentation

### v1.0.3
- Updated repository URLs to match new repo name
- Improved documentation

### v1.0.2
- Moved `viem` to direct dependencies (no manual install required)
- Updated documentation

### v1.0.1
- Added repository info for GitHub linking
- Improved documentation

### v1.0.0
- Initial release
- Support for Ethereum, BSC, Base, and Solana
- Custom RPC URL support
- TypeScript definitions

## Contributing

Contributions are welcome! Please open an issue or submit a PR on [GitHub](https://github.com/dilukangelosl/crypto-price-fetcher-v2).

## License

MIT © 2024
