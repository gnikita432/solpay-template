export const NON_BREAKING_SPACE = '\u00a0';
export const CLUSTER_ENDPOINT = process.env.NEXT_PUBLIC_CLUSTER_ENDPOINT || 'https://api.devnet.solana.com';
export const SHOP_PROGRAM_ID = process.env.NEXT_PUBLIC_SHOP_PROGRAM_ID || '';

// API routes
export const GET_PRODUCTS_URL = '/api/products';
export const WALLET_PAYMENT_URL = '/api/wallet';
export const QR_PAYMENT_URL = '/api/qrcode';
export const QR_CLAIM_URL = '/api/claim';
