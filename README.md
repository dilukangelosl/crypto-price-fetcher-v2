# crypto-price-fetcher

Fetch real-time cryptocurrency prices from DEX pools via public RPCs. No API keys required.

## Supported Chains

| Chain | Token | Source |
|-------|-------|--------|
| Ethereum | ETH | Uniswap V3 Quoter |
| BSC | BNB | PancakeSwap V3 Quoter |
| Base | ETH | Uniswap V3 Quoter |
| Solana | SOL | DexScreener API |

## Installation

```bash
npm install crypto-price-fetcher viem
# or
bun add crypto-price-fetcher viem
```

## Usage

### Simple Usage

```typescript
import { getETHPrice, getBNBPrice, getSOLPrice, getAllPrices } from 'crypto-price-fetcher';

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
// {
//   ethereum: { chain: 'ethereum', symbol: 'ETH', price: 2247.63, timestamp: ... },
//   bsc: { chain: 'bsc', symbol: 'BNB', price: 751.30, timestamp: ... },
//   base: { chain: 'base', symbol: 'ETH', price: 2245.64, timestamp: ... },
//   solana: { chain: 'solana', symbol: 'SOL', price: 102.07, timestamp: ... }
// }
```

### With Custom RPC URLs

```typescript
import { getETHPrice, getAllPrices } from 'crypto-price-fetcher';

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

### Get Specific Chain Price

```typescript
import { getPrice } from 'crypto-price-fetcher';

const result = await getPrice('ethereum');
console.log(result);
// { chain: 'ethereum', symbol: 'ETH', price: 2247.63, timestamp: 1706889600000 }
```

## API Reference

### Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getETHPrice(options?)` | `Promise<number>` | ETH price in USD |
| `getBNBPrice(options?)` | `Promise<number>` | BNB price in USD |
| `getSOLPrice()` | `Promise<number>` | SOL price in USD |
| `getBaseETHPrice(options?)` | `Promise<number>` | Base ETH price in USD |
| `getPrice(chain, options?)` | `Promise<PriceResult>` | Price for specific chain |
| `getAllPrices(options?)` | `Promise<Record<ChainId, PriceResult>>` | All chain prices |

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

- **EVM Chains**: Uses on-chain Quoter V2 contracts (Uniswap/PancakeSwap) to simulate swaps and get accurate prices
- **Solana**: Uses DexScreener's aggregated API which sources data from on-chain DEXes

## License

MIT
