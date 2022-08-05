import { useQRPayment } from '../client/hooks/useQRPayment';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { QRCode } from '../client/components/common/QRCode';
import { PoweredBy } from '../client/components/common/PoweredBy';
import { Amount } from '../client/components/common/Amount';
import { BackArrowButton } from '../client/components/button/BackArrowButton';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import css from './payqr.module.css';

const PayQR: NextPage = () => {
    const router = useRouter();
    let params = new URLSearchParams(document.location.search);
    let price = params.get('price') || '0.00';
    let memo = params.get('id') || '';
    const label = params.get('name') || '';
    const comicId = params.get('id') || '';
    const message = 'Great Collections of Comic';
    const amount = new BigNumber(price);

    const { generate, url } = useQRPayment({ amount, label, message, defaultMemo: memo, comicId });

    useEffect(() => {
        generate();
    }, [generate]);

    return (
        <div className={css.root}>
            <div className={css.header}>
                <BackArrowButton onClick={() => router.push('/')}>Cancel</BackArrowButton>
            </div>
            <div className={css.main}>
                <div className={css.amount}>
                    <Amount amount={amount} />
                </div>
                <div className={css.symbol}>SOL</div>
                <div className={css.code}>
                    <QRCode url={url} />
                </div>
                <div className={css.scan}>Scan this code with your Solana Pay wallet</div>
                <div className={css.confirm}>You&apos;ll be asked to approve the transaction</div>
            </div>
            <div className={css.footer}>
                <PoweredBy />
            </div>
        </div>
    );
};

export default PayQR;

export function getServerSideProps() {
    // Required so getInitialProps re-runs on the server-side
    // If it runs on client-side then there's no req and the URL reading doesn't work
    // See https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
    return {
        props: {},
    };
}
