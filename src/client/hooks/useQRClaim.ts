import { encodeURL, findReference, FindReferenceError, validateTransfer, ValidateTransferError } from '@solana/pay';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo, Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useGlobal } from '../hooks/useGlobal';
import { PaymentStatus } from '../types';
import { Confirmations } from '../types';

export const useQRPayment = () => {
    const { connection } = useConnection();
    const { link, requiredConfirmations = 1 } = useGlobal();
    const router = useRouter();
    const [reference, setReference] = useState<PublicKey>();
    const [status, setStatus] = useState(PaymentStatus.New);
    const [signature, setSignature] = useState<TransactionSignature>();
    const [confirmations, setConfirmations] = useState<Confirmations>(0);
    const progress = useMemo(() => confirmations / requiredConfirmations, [confirmations, requiredConfirmations]);

    const url = useMemo(() => {
        const url = new URL(String(link));

        if (reference) {
            url.searchParams.append('reference', reference.toBase58());
        }

        return encodeURL({ link: url });
    }, [link, reference]);

    const reset = useCallback(() => {
        setReference(undefined);
        setStatus(PaymentStatus.New);
        setConfirmations(0);
    }, []);

    const generate = useCallback(() => {
        if (status === PaymentStatus.New && !reference) {
            setReference(Keypair.generate().publicKey);
            setStatus(PaymentStatus.Pending);
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
                console.log(signature);
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

    return {
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
