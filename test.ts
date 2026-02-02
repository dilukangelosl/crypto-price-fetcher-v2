/**
 * Quick test of the crypto-price-fetcher module
 */
import { getETHPrice, getBNBPrice, getSOLPrice, getAllPrices } from './src/index';

console.log('🧪 Testing crypto-price-fetcher...\n');

try {
    console.log('Fetching all prices...');
    const prices = await getAllPrices();

    console.log('\n📊 Results:');
    for (const [chain, data] of Object.entries(prices)) {
        console.log(`  ${chain}: $${data.price.toFixed(2)} (${data.symbol})`);
    }

    console.log('\n✅ Module working correctly!');
} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
