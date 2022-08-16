import * as anchor from '@project-serum/anchor';
import { utils } from '@project-serum/anchor';
import { CLUSTER_ENDPOINT, PUBLIC_SHOP_PROGRAM_ID } from './env';
import IDL from '../../artifacts/idl.json';
import { Store } from '../../artifacts/store-type';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export const createAddInstruction = async (buyerPublicKey: PublicKey, itemID: string) => {
    // program interaction with anchor
    const anchorKeyPair = new anchor.web3.Keypair();
    const dummyWallet = new anchor.Wallet(anchorKeyPair);
    const opts = {
        preflightCommitment: 'processed' as anchor.web3.ConfirmOptions,
    };

    const getProvider = () => {
        const network = CLUSTER_ENDPOINT;
        const connection = new anchor.web3.Connection(network, opts.preflightCommitment);
        const provider = new anchor.AnchorProvider(connection, dummyWallet, opts.preflightCommitment);
        return provider;
    };

    const provider = getProvider();
    const idl = IDL as Store;
    const STORE_PROGRAM_ID = new PublicKey(PUBLIC_SHOP_PROGRAM_ID);
    const [shopProgramPDA, _] = await PublicKey.findProgramAddress(
        [utils.bytes.utf8.encode('user-stats'), buyerPublicKey.toBuffer()],
        STORE_PROGRAM_ID
    );
    const program = new anchor.Program(idl, STORE_PROGRAM_ID, provider);
    let hasComics: boolean;
    try {
        const { comics } = await program.account.customers.fetch(shopProgramPDA);
        hasComics = comics.length > 0;
    } catch (err) {
        // account does not exist
        hasComics = false;
    }

    let addComicInstruction: TransactionInstruction;
    if (hasComics) {
        addComicInstruction = await program.methods
            .addComic(itemID)
            .accounts({
                user: buyerPublicKey,
                customer: shopProgramPDA,
            })
            .instruction();
    } else {
        addComicInstruction = await program.methods
            .createCustomer(buyerPublicKey.toString(), itemID)
            .accounts({
                user: buyerPublicKey,
                customer: shopProgramPDA,
            })
            .instruction();
    }

    return addComicInstruction;
};
