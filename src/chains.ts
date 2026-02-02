/**
 * Chain configuration types and defaults
 */

export type ChainId = 'ethereum' | 'bsc' | 'base' | 'solana';

export interface ChainConfig {
    id: ChainId;
    name: string;
    type: 'evm' | 'solana';
    symbol: string;
    rpcUrl: string;
    quoterAddress?: `0x${string}`;
    wrappedNativeAddress?: `0x${string}`;
    stableAddress?: `0x${string}`;
    stableDecimals?: number;
    poolFee?: number;
}

export const DEFAULT_CHAINS: Record<ChainId, ChainConfig> = {
    ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        type: 'evm',
        symbol: 'ETH',
        rpcUrl: 'https://ethereum-rpc.publicnode.com',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        wrappedNativeAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        stableAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        stableDecimals: 6,
        poolFee: 3000,
    },
    bsc: {
        id: 'bsc',
        name: 'BNB Smart Chain',
        type: 'evm',
        symbol: 'BNB',
        rpcUrl: 'https://bsc-rpc.publicnode.com',
        quoterAddress: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
        wrappedNativeAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        stableAddress: '0x55d398326f99059fF775485246999027B3197955',
        stableDecimals: 18,
        poolFee: 2500,
    },
    base: {
        id: 'base',
        name: 'Base',
        type: 'evm',
        symbol: 'ETH',
        rpcUrl: 'https://base-rpc.publicnode.com',
        quoterAddress: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
        wrappedNativeAddress: '0x4200000000000000000000000000000000000006',
        stableAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        stableDecimals: 6,
        poolFee: 500,
    },
    solana: {
        id: 'solana',
        name: 'Solana',
        type: 'solana',
        symbol: 'SOL',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
    },
};
