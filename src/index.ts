/**
 * crypto-price-fetcher
 * 
 * Fetch real-time cryptocurrency prices from DEX pools via public RPCs.
 * Supports Ethereum, BSC, Base, and Solana.
 */

import { fetchEVMPrice } from './evm';
import { fetchSolanaPrice } from './solana';
import { DEFAULT_CHAINS, type ChainId, type ChainConfig } from './chains';

export type { ChainId, ChainConfig };
export { DEFAULT_CHAINS };

export interface PriceResult {
    chain: ChainId;
    symbol: string;
    price: number;
    timestamp: number;
}

export interface FetchOptions {
    /** Custom RPC URLs per chain */
    rpcUrls?: Partial<Record<ChainId, string>>;
    /** Override default chain configs */
    chainConfigs?: Partial<Record<ChainId, Partial<ChainConfig>>>;
}

/**
 * Fetch price for a specific chain
 */
export async function getPrice(chain: ChainId, options?: FetchOptions): Promise<PriceResult> {
    const config = buildConfig(chain, options);

    let price: number;

    if (config.type === 'evm') {
        price = await fetchEVMPrice(config);
    } else if (config.type === 'solana') {
        price = await fetchSolanaPrice();
    } else {
        throw new Error(`Unknown chain type: ${config.type}`);
    }

    return {
        chain,
        symbol: config.symbol,
        price,
        timestamp: Date.now(),
    };
}

/**
 * Fetch prices for all supported chains
 */
export async function getAllPrices(options?: FetchOptions): Promise<Record<ChainId, PriceResult>> {
    const chains: ChainId[] = ['ethereum', 'bsc', 'base', 'solana'];

    const results = await Promise.allSettled(
        chains.map(chain => getPrice(chain, options))
    );

    const prices: Partial<Record<ChainId, PriceResult>> = {};

    results.forEach((result, index) => {
        const chain = chains[index];
        if (result.status === 'fulfilled') {
            prices[chain] = result.value;
        }
    });

    return prices as Record<ChainId, PriceResult>;
}

/**
 * Fetch ETH price (Ethereum mainnet)
 */
export async function getETHPrice(options?: FetchOptions): Promise<number> {
    const result = await getPrice('ethereum', options);
    return result.price;
}

/**
 * Fetch BNB price (BSC)
 */
export async function getBNBPrice(options?: FetchOptions): Promise<number> {
    const result = await getPrice('bsc', options);
    return result.price;
}

/**
 * Fetch SOL price (Solana)
 */
export async function getSOLPrice(): Promise<number> {
    const result = await getPrice('solana');
    return result.price;
}

/**
 * Fetch Base ETH price
 */
export async function getBaseETHPrice(options?: FetchOptions): Promise<number> {
    const result = await getPrice('base', options);
    return result.price;
}

function buildConfig(chain: ChainId, options?: FetchOptions): ChainConfig {
    const baseConfig = { ...DEFAULT_CHAINS[chain] };

    // Apply custom RPC URL
    if (options?.rpcUrls?.[chain]) {
        baseConfig.rpcUrl = options.rpcUrls[chain]!;
    }

    // Apply custom chain config overrides
    if (options?.chainConfigs?.[chain]) {
        Object.assign(baseConfig, options.chainConfigs[chain]);
    }

    return baseConfig;
}
