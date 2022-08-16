import React, { useState, useMemo, FunctionComponent, Dispatch, SetStateAction, useEffect } from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ThreeDots } from 'react-loader-spinner';
import styles from '../styles/Product.module.css';
import { WALLET_PAYMENT_URL } from '../utils/constants';
import IPFSDownload from './IpfsDownload';
import { findReference, FindReferenceError } from '@solana/pay';

enum STATUS {
    Initial = 'Initial',
    Submitted = 'Submitted',
    Paid = 'Paid',
}

export interface BuyProps {
    itemID: number;
    togglePaymentState: (val: boolean) => void;
}

export const Buy: FunctionComponent<BuyProps> = ({ itemID, togglePaymentState }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

    const [loading, setLoading] = useState(false); // Loading state of all above
    const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status
    const [paid, setPaid] = useState(false);

    // useMemo is a React hook that only computes the value if the dependencies change
    const order = useMemo(
        () => ({
            buyer: publicKey ? publicKey.toBase58() : 'noBuyer',
            orderID: orderID.toString(),
            itemID: itemID,
        }),
        [publicKey, orderID, itemID]
    );

    // Fetch the transaction object from the server
    const processTransaction = async () => {
        setLoading(true);
        const txResponse = await fetch(WALLET_PAYMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        const txData = await txResponse.json();

        // We create a transaction object
        const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));

        // Attempt to send the transaction to the network
        try {
            // Send the transaction to the network
            const txHash = await sendTransaction(tx, connection);
            // VALIDATE payment here , this is set to true assuming all payments passsed
            setStatus(STATUS.Submitted);
        } catch (error) {
            console.error(error);
            alert('Error: Payment Unsuccessful');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if transaction was confirmed
        if (status === STATUS.Submitted) {
            setLoading(true);
            const interval = setInterval(async () => {
                try {
                    const signatureInfo = await findReference(connection, orderID);

                    togglePaymentState(false);
                    clearInterval(interval);
                    setStatus(STATUS.Paid);
                    setPaid(true);
                    setLoading(false);
                } catch (e) {
                    if (e instanceof FindReferenceError) {
                        return null;
                    }
                    console.error('Unknown error', e);
                } finally {
                    setLoading(false);
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [status]);

    useEffect(() => {
        if (paid) {
            alert('Thank you for your purchase!');
        }
    }, [paid]);

    if (!publicKey) {
        return (
            <div>
                <p className={styles.content}>You need to connect your wallet to make transactions</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.loadingDots}>
                <ThreeDots color="#DC1FFF" height={80} width={80} />
            </div>
        );
    }

    return (
        <div>
            {status === STATUS.Paid ? (
                <IPFSDownload filename="spiderman-comic.zip" hash="QmTAEowJmKNUiP6sBkJ7yFinX6ZCBfN9duwWtsmz89G9kR" />
            ) : (
                <button disabled={loading} className={styles.buyButton} onClick={processTransaction}>
                    Pay using WALLET EXTENSION
                </button>
            )}
        </div>
    );
};
