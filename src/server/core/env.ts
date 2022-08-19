export const CLUSTER_ENDPOINT = process.env.NEXT_PUBLIC_CLUSTER_ENDPOINT || 'https://api.devnet.solana.com';
export const SHOP_ADDRESS = process.env.NEXT_PUBLIC_STORE_ADDRESS || '';
export const SHOP_USDC_ADDRESS = process.env.NEXT_PUBLIC_SELLER_USDCADDRESS || '';
export const MEMO_PROGRAM_ID = process.env.MEMO_PROGRAM_ID || '';
export const PUBLIC_SHOP_PROGRAM_ID = process.env.NEXT_PUBLIC_SHOP_PROGRAM_ID || '';

export const RATE_LIMIT = Number(process.env.RATE_LIMIT) || undefined;
export const RATE_LIMIT_INTERVAL = Number(process.env.RATE_LIMIT_INTERVAL) || undefined;

export const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
