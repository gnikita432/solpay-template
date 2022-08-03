import { ConfirmOptions, Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import idl from '../../artifacts/idl.json';
import { Store } from '../../artifacts/store-type';
import { useEffect, useState } from 'react';
import { CLUSTER_ENDPOINT, SHOP_PROGRAM_ID } from '../utils/constants';

const opts = {
    preflightCommitment: 'processed',
};
const programID = new PublicKey(SHOP_PROGRAM_ID);

export const useProgram = () => {
    const { wallet, publicKey } = useWallet();
    const walletAnchor = useAnchorWallet();
    const [customer, setCustomer] = useState<anchor.IdlTypes<Store>>();
    const [program, setProgram] = useState<anchor.Program<Store>>();

    useEffect(() => {
        const init = async () => {
            const provider = await getProvider();
            const program = new Program(idl as any, programID, provider);
            setProgram(program);
            console.log('Program initialized');
        };
        if (wallet && publicKey) {
            init();
        }
    }, [wallet, publicKey]);

    async function getProvider() {
        const connection = new Connection(CLUSTER_ENDPOINT, opts.preflightCommitment as any);
        const provider = new AnchorProvider(
            connection,
            walletAnchor as any,
            opts.preflightCommitment as ConfirmOptions
        );
        return provider;
    }

    const getProgramPDA = async (program: anchor.Program<Store>, publicKey: PublicKey) => {
        const [shopProgramPDA, _] = await PublicKey.findProgramAddress(
            [anchor.utils.bytes.utf8.encode('user-stats'), publicKey.toBuffer()],
            program.programId
        );
        return shopProgramPDA;
    };

    const createCustomer = async (firstComicId: string) => {
        if (program && publicKey) {
            const PDA = await getProgramPDA(program, publicKey);
            try {
                await program.methods
                    .createCustomer(publicKey.toString(), firstComicId)
                    .accounts({
                        user: publicKey,
                        customer: PDA,
                    })
                    .rpc();
            } catch (err) {
                console.log('Error creating customer', err);
            }
        }
    };

    const addComic = async (comic: string) => {
        if (program && publicKey) {
            const PDA = await getProgramPDA(program, publicKey);
            await program.methods
                .addComic(comic)
                .accounts({
                    user: publicKey,
                    customer: PDA,
                })
                .rpc();
        }
    };

    const fetchCustomer = async () => {
        if (program && publicKey) {
            try {
                const PDA = await getProgramPDA(program, publicKey);
                const progCustomer = await program.account.customers.fetch(PDA);
                setCustomer(progCustomer);
                return customer;
            } catch (err) {
                console.log('Error fetching customer', err);
            }
        }
    };

    return { createCustomer, fetchCustomer, addComic, publicKey, customer, program };
};
