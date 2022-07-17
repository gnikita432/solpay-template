import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Store } from '../target/types/store';
import { expect } from 'chai';

describe('Store', async () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Store as Program<Store>;

    it('Create Customer', async () => {
        const [userStatsPDA, _] = await PublicKey.findProgramAddress(
            [anchor.utils.bytes.utf8.encode('user-stats'), provider.wallet.publicKey.toBuffer()],
            program.programId
        );

        await program.methods
            .createCustomer('brian', '183i')
            .accounts({
                user: provider.wallet.publicKey,
                customer: userStatsPDA,
            })
            .rpc();

        expect((await program.account.customers.fetch(userStatsPDA)).name).to.equal('brian');
    });

    it('Add comic1', async () => {
        const [userStatsPDA, _] = await PublicKey.findProgramAddress(
            [anchor.utils.bytes.utf8.encode('user-stats'), provider.wallet.publicKey.toBuffer()],
            program.programId
        );

        await program.methods
            .addComic('comic1')
            .accounts({
                user: provider.wallet.publicKey,
                customer: userStatsPDA,
            })
            .rpc();

        const userStat = await program.account.customers.fetch(userStatsPDA);
        expect(userStat.comics).to.contain('comic1');
    });

    it('Add comic2', async () => {
        const [userStatsPDA, _] = await PublicKey.findProgramAddress(
            [anchor.utils.bytes.utf8.encode('user-stats'), provider.wallet.publicKey.toBuffer()],
            program.programId
        );

        await program.methods
            .addComic('comic2')
            .accounts({
                user: provider.wallet.publicKey,
                customer: userStatsPDA,
            })
            .rpc();

        const userStat = await program.account.customers.fetch(userStatsPDA);
        expect(userStat.comics).to.contain('comic2');
    });
});
