/**
 * EVM price fetcher using Uniswap V3 / PancakeSwap V3 Quoter contracts
 */

import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet, bsc, base } from 'viem/chains';
import type { ChainConfig } from './chains';

const QUOTER_V2_ABI = parseAbi([
    'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
]);

const chainMap = {
    ethereum: mainnet,
    bsc: bsc,
    base: base,
} as const;

type EVMChainId = keyof typeof chainMap;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clients = new Map<EVMChainId, any>();

function getClient(config: ChainConfig) {
    const chainId = config.id as EVMChainId;

    if (!clients.has(chainId)) {
        const chain = chainMap[chainId];
        if (!chain) throw new Error(`Unsupported EVM chain: ${chainId}`);

        clients.set(chainId, createPublicClient({
            chain,
            transport: http(config.rpcUrl),
            batch: { multicall: true },
        }));
    }

    return clients.get(chainId);
}

export async function fetchEVMPrice(config: ChainConfig): Promise<number> {
    if (config.type !== 'evm') {
        throw new Error(`Invalid chain type for EVM fetcher: ${config.type}`);
    }

    const client = getClient(config);
    const amountIn = BigInt(10 ** 18);

    const data = await client.readContract({
        address: config.quoterAddress!,
        abi: QUOTER_V2_ABI,
        functionName: 'quoteExactInputSingle',
        args: [{
            tokenIn: config.wrappedNativeAddress!,
            tokenOut: config.stableAddress!,
            amountIn,
            fee: config.poolFee!,
            sqrtPriceLimitX96: BigInt(0),
        }],
    });

    const amountOut = Array.isArray(data) ? data[0] : data;
    return Number(amountOut) / (10 ** config.stableDecimals!);
}
