export const CLUSTER_ENDPOINT = process.env.NEXT_PUBLIC_CLUSTER_ENDPOINT || 'https://api.devnet.solana.com';
export const SHOP_ADDRESS = process.env.NEXT_PUBLIC_STORE_ADDRESS || '';
export const RATE_LIMIT = Number(process.env.RATE_LIMIT) || undefined;
export const RATE_LIMIT_INTERVAL = Number(process.env.RATE_LIMIT_INTERVAL) || undefined;
