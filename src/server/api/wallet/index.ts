import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { NextApiHandler } from 'next';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { cors, rateLimit } from '../../middleware';
import { utils } from '@project-serum/anchor';
import {
    SHOP_ADDRESS,
    SHOP_USDC_ADDRESS,
    connection,
    PUBLIC_SHOP_PROGRAM_ID,
    newComic,
    newComicWithCustomer,
} from '../../core';

// Make sure you replace this with your wallet address!
const sellerPublicKey = new PublicKey(SHOP_ADDRESS);
const usdcAddress = new PublicKey(SHOP_USDC_ADDRESS);

interface PostResponse {
    transaction: string;
    message?: string;
}

const post: NextApiHandler<PostResponse> = async (req, res) => {
    const buyer = req.body?.buyer;
    if (!buyer) throw new Error('Missing buyer address');

    const orderID = req.body?.orderID;
    if (!orderID) throw new Error('Missing order ID');

    const itemID = req.body?.itemID;
    if (!itemID) throw new Error('Item not found. please check item ID');

    const products = require('../../data/products.json');

    // Fetch item price from products.json using itemID
    const itemPrice = products.find((item: any) => item.id === itemID).price;

    const bigAmount = new BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);

    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);

    const { blockhash } = await connection.getLatestBlockhash('finalized');

    const usdcMint = await getMint(connection, usdcAddress);

    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPublicKey;

    const transferInstruction = createTransferCheckedInstruction(
        buyerUsdcAddress,
        usdcAddress,
        shopUsdcAddress,
        buyerPublicKey,
        bigAmount.toNumber() * 10 ** usdcMint.decimals,
        usdcMint.decimals // The token could have any number of decimals
    );

    // We're adding more instructions to the transaction
    // @todo: refactor
    transferInstruction.keys.push({
        // We'll use our OrderId to find this transaction later
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
    });
    transaction.add(transferInstruction);

    // const STORE_PROGRAM_ID = new PublicKey(PUBLIC_SHOP_PROGRAM_ID);
    // const [shopProgramPDA, _] = await PublicKey.findProgramAddress(
    //     [utils.bytes.utf8.encode('user-stats'), buyerPublicKey.toBuffer()],
    //     STORE_PROGRAM_ID
    // );
    // const programPayload = await connection.getProgramAccounts(STORE_PROGRAM_ID);
    // const hasComics = programPayload.find((item) => item.pubkey.toString() === shopProgramPDA.toString());

    // const instructionBuff = hasComics ? newComic(orderID) : newComicWithCustomer(buyerPublicKey.toString(), orderID);
    // const addComicInstruction = new TransactionInstruction({
    //     programId: STORE_PROGRAM_ID,
    //     keys: [
    //         {
    //             isWritable: false,
    //             isSigner: true,
    //             pubkey: buyerPublicKey,
    //         },
    //         {
    //             isWritable: true,
    //             isSigner: false,
    //             pubkey: shopProgramPDA,
    //         },
    //     ],
    //     data: instructionBuff,
    // });

    // transaction.add(addComicInstruction);

    // Formatting our transaction
    const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString('base64');

    res.status(200).json({
        transaction: base64,
    });
};

const index: NextApiHandler<PostResponse> = async (request, response) => {
    await cors(request, response);
    await rateLimit(request, response);

    if (request.method === 'POST') return post(request, response);

    throw new Error(`Unexpected method ${request.method}`);
};

export default index;
