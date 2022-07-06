import React, { useState, useMemo, FunctionComponent , Dispatch, SetStateAction} from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Circles } from 'react-loader-spinner';
import styles from "../styles/Product.module.css";
import IPFSDownload from './IpfsDownload';

export interface BuyProps {
    itemID: number;
    togglePaymentState :  ( val : boolean) => void;
}

export const Buy: FunctionComponent<BuyProps> = ({ itemID , togglePaymentState}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state of all above

    // useMemo is a React hook that only computes the value if the dependencies change
    const order = useMemo(
        () => ({
            buyer: publicKey ? publicKey.toString() : 'noBuyer',
            orderID: orderID.toString(),
            itemID: itemID,
        }),
        [publicKey, orderID, itemID]
    );

    // Fetch the transaction object from the server
    const processTransaction = async () => {
        setLoading(true);
        const txResponse = await fetch('../api/createTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        const txData = await txResponse.json();

        // We create a transaction object
        const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
        console.log('Tx data is', tx);

        // Attempt to send the transaction to the network
        try {
            // Send the transaction to the network
            const txHash = await sendTransaction(tx, connection);
            console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
            //NIKITA : VALIDATE payment here , this is set to true assuming all payments passsed
            setPaid(true);
            togglePaymentState(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div>
                <p>You need to connect your wallet to make transactions</p>
            </div>
        );
    }

    if (loading) {
        return <Circles color="gray" />;
    }

    return (
        <div>
            {paid ? (
                <IPFSDownload filename="spiderman-comic.zip" hash="QmTAEowJmKNUiP6sBkJ7yFinX6ZCBfN9duwWtsmz89G9kR" />
            ) : (
                <button disabled={loading} className={styles.buyButton} onClick={processTransaction}>
                    Pay using WALLET EXTENSION
                </button>
            )}
        </div>
    );
};
