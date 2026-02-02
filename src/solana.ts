/**
 * Solana price fetcher using DexScreener API
 */

const DEXSCREENER_API = 'https://api.dexscreener.com/tokens/v1/solana';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

interface DexScreenerPair {
    baseToken: { address: string; symbol: string };
    quoteToken: { address: string; symbol: string };
    priceUsd?: string;
    liquidity?: { usd: number };
}

export async function fetchSolanaPrice(): Promise<number> {
    const response = await fetch(`${DEXSCREENER_API}/${SOL_MINT}`, {
        headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
    }

    const data = await response.json() as DexScreenerPair[];

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No SOL pairs found');
    }

    // Find high-liquidity stablecoin pairs
    const stablePairs = data.filter(pair =>
        pair.baseToken?.address === SOL_MINT &&
        (pair.quoteToken?.symbol === 'USDC' || pair.quoteToken?.symbol === 'USDT') &&
        pair.priceUsd &&
        pair.liquidity?.usd && pair.liquidity.usd > 100000
    );

    if (stablePairs.length > 0) {
        stablePairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
        const topPair = stablePairs[0];
        if (topPair?.priceUsd) {
            return parseFloat(topPair.priceUsd);
        }
    }

    // Fallback to any liquid pair
    const anyPair = data.find(p => p.priceUsd && p.liquidity?.usd && p.liquidity.usd > 100000);
    if (anyPair?.priceUsd) {
        return parseFloat(anyPair.priceUsd);
    }

    // Last resort
    const firstPair = data.find(p => p.priceUsd);
    if (firstPair?.priceUsd) {
        return parseFloat(firstPair.priceUsd);
    }

    throw new Error('Could not determine SOL price');
}
