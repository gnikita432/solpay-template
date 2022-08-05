import React, { FunctionComponent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Modal.module.css';
import { useQRPayment } from '../hooks/useQRClaim';
import { QRCode } from './common/QRCode';

export interface ClaimModalProps {
    isShown: boolean;
    hide: () => void;
}

export const ClaimModal: FunctionComponent<ClaimModalProps> = ({ isShown, hide }) => {
    const { generate, url } = useQRPayment();

    useEffect(() => {
        generate();
    }, [generate]);

    const modal = (
        <>
            <div className={styles.backdrop}></div>
            <div className={styles.wrapper}>
                <div className={styles.styledModal}>
                    <div className={styles.header}>
                        <div className={styles.headerText}>Scan to Claim Comics</div>
                        <button className={styles.closeButton} onClick={hide}>
                            X
                        </button>
                    </div>
                    <div>
                        <QRCode url={url} />
                    </div>
                </div>
            </div>
        </>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
