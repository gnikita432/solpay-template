import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { NextApiHandler } from 'next';
import { cors, rateLimit } from '../../middleware';
import { connection, MEMO_PROGRAM_ID } from '../../core';

interface GetResponse {
    label: string;
    icon: string;
}

const get: NextApiHandler<GetResponse> = async (request, response) => {
    const icon = `https://${request.headers.host}/solana-pay-logo.svg`;

    response.status(200).send({
        label: 'Claim Comics',
        icon,
    });
};

interface PostResponse {
    transaction: string;
    message?: string;
}

const post: NextApiHandler<PostResponse> = async (request, response) => {
    /*
    Transfer request params provided in the URL by the app client. In practice, these should be generated on the server,
    persisted along with an unpredictable opaque ID representing the payment, and the ID be passed to the app client,
    which will include the ID in the transaction request URL. This prevents tampering with the transaction request.
    */

    const referenceField = request.query.reference;
    if (!referenceField) throw new Error('missing reference');
    if (typeof referenceField !== 'string') throw new Error('invalid reference');
    let reference = new PublicKey(referenceField);

    // Account provided in the transaction request body by the wallet.
    const accountField = request.body?.account;
    if (!accountField) throw new Error('missing account');
    if (typeof accountField !== 'string') throw new Error('invalid account');
    const account = new PublicKey(accountField);

    // Store pubkey in Solana memo program
    let transaction = new Transaction();
    const PROGRAM_ID = new PublicKey(MEMO_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [],
        data: Buffer.from(accountField, 'utf8'),
    });

    // Add the transfer instruction to the transaction
    transaction.add(instruction);

    const hashResponse = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = hashResponse.blockhash;
    transaction.feePayer = account;

    // Serialize and deserialize the transaction. This ensures consistent ordering of the account keys for signing.
    transaction = Transaction.from(
        transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
        })
    );

    // Serialize and return the unsigned transaction.
    const serialized = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
    });
    const base64 = serialized.toString('base64');
    response.status(200).send({ transaction: base64 });
};

const index: NextApiHandler<GetResponse | PostResponse> = async (request, response) => {
    await cors(request, response);
    await rateLimit(request, response);

    if (request.method === 'GET') return get(request, response);
    if (request.method === 'POST') return post(request, response);

    throw new Error(`Unexpected method ${request.method}`);
};

export default index;
