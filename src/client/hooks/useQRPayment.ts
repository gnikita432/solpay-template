import { encodeURL, findReference, FindReferenceError, validateTransfer, ValidateTransferError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo, Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useGlobal } from '../hooks/useGlobal';
import { PaymentStatus } from '../types';
import { Confirmations } from '../types';

export interface IUseQRCodePayment {
    amount: BigNumber;
    label?: string;
    message?: string;
}

export const useQRPayment = ({ amount, label, message }: IUseQRCodePayment) => {
    const { connection } = useConnection();
    const { storeAddress, link, requiredConfirmations = 1 } = useGlobal();
    const router = useRouter();
    const [memo, setMemo] = useState<string>();
    const [reference, setReference] = useState<PublicKey>();
    const [signature, setSignature] = useState<TransactionSignature>();
    const [status, setStatus] = useState(PaymentStatus.New);
    const [confirmations, setConfirmations] = useState<Confirmations>(0);
    const recipient = useMemo(() => new PublicKey(storeAddress), [storeAddress]);
    const progress = useMemo(() => confirmations / requiredConfirmations, [confirmations, requiredConfirmations]);

    const url = useMemo(() => {
        const url = new URL(String(link));
        url.searchParams.append('recipient', recipient.toBase58());
        url.searchParams.append('amount', amount.toFixed(amount.decimalPlaces()));
        if (amount) {
        }

        if (reference) {
            url.searchParams.append('reference', reference.toBase58());
        }

        if (memo) {
            url.searchParams.append('memo', memo);
        }

        if (label) {
            url.searchParams.append('label', label);
        }

        if (message) {
            url.searchParams.append('message', message);
        }
        return encodeURL({ link: url });
    }, [recipient, link, amount, reference, label, message, memo]);

    const reset = useCallback(() => {
        setMemo(undefined);
        setReference(undefined);
        setSignature(undefined);
        setStatus(PaymentStatus.New);
        setConfirmations(0);
    }, []);

    const generate = useCallback(() => {
        if (status === PaymentStatus.New && !reference) {
            console.log('Generate called');
            setReference(Keypair.generate().publicKey);
            setStatus(PaymentStatus.Pending);
            // router.push('/pending-qr');
        }
    }, [status, reference]);

    // When the status is pending, poll for the transaction using the reference key
    useEffect(() => {
        if (!(status === PaymentStatus.Pending && reference && !signature)) return;
        let changed = false;

        const interval = setInterval(async () => {
            let signature: ConfirmedSignatureInfo;
            try {
                signature = await findReference(connection, reference);

                if (!changed) {
                    clearInterval(interval);
                    setSignature(signature.signature);
                    setStatus(PaymentStatus.Confirmed);
                    router.push('/confirmed');
                }
            } catch (error: any) {
                // If the RPC node doesn't have the transaction signature yet, try again
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                }
            }
        }, 250);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, reference, signature, connection, router]);

    // When the status is confirmed, validate the transaction against the provided params
    useEffect(() => {
        if (!(status === PaymentStatus.Confirmed && signature && amount)) return;
        let changed = false;

        const run = async () => {
            try {
                await validateTransfer(connection, signature, { recipient, amount, reference });

                if (!changed) {
                    setStatus(PaymentStatus.Valid);
                }
            } catch (error: any) {
                // If the RPC node doesn't have the transaction yet, try again
                if (
                    error instanceof ValidateTransferError &&
                    (error.message === 'not found' || error.message === 'missing meta')
                ) {
                    console.warn(error);
                    timeout = setTimeout(run, 250);
                    return;
                }

                console.error(error);
                setStatus(PaymentStatus.Invalid);
            }
        };
        let timeout = setTimeout(run, 0);

        return () => {
            changed = true;
            clearTimeout(timeout);
        };
    }, [status, signature, amount, connection, recipient, reference]);

    // When the status is valid, poll for confirmations until the transaction is finalized
    useEffect(() => {
        if (!(status === PaymentStatus.Valid && signature)) return;
        let changed = false;

        const interval = setInterval(async () => {
            try {
                const response = await connection.getSignatureStatus(signature);
                const status = response.value;
                if (!status) return;
                if (status.err) throw status.err;

                if (!changed) {
                    const confirmations = (status.confirmations || 0) as Confirmations;
                    setConfirmations(confirmations);

                    if (confirmations >= requiredConfirmations || status.confirmationStatus === 'finalized') {
                        clearInterval(interval);
                        setStatus(PaymentStatus.Finalized);
                    }
                }
            } catch (error: any) {
                console.log(error);
            }
        }, 250);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, connection, requiredConfirmations]);

    return {
        amount,
        memo,
        setMemo,
        reference,
        signature,
        status,
        confirmations,
        progress,
        url,
        reset,
        generate,
    };
};
