import React, { FunctionComponent, Dispatch, SetStateAction } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Modal.module.css';
import { Buy } from './Buy';
import { useRouter } from 'next/router';

export interface ModalProps {
    isShown: boolean;
    hide: () => void;
    togglePaymentState: (val: boolean) => void;
    productId: number;
    price: string;
    name: string;
    description: string;
}

export const Modal: FunctionComponent<ModalProps> = ({
    isShown,
    hide,
    togglePaymentState,
    productId,
    price,
    name,
    description,
}) => {
    const router = useRouter();

    const handlePayQRCode = () => {
        const query = `?price=${price}&id=${productId}&name=${name}&description=${description}`;
        return router.push(`/payqr${query}`);
    };

    const modal = (
        <>
            <div className={styles.backdrop}></div>
            <div className={styles.wrapper}>
                <div className={styles.styledModal}>
                    <div className={styles.header}>
                        <div className={styles.headerText}>Payment Method</div>
                        <button className={styles.closeButton} onClick={hide}>
                            X
                        </button>
                    </div>
                    <div className={styles.modalcontent}>
                        <button className={styles.content} onClick={handlePayQRCode}>
                            Pay using QR CODE
                        </button>
                        <p className={styles.option}>OR</p>
                        <Buy itemID={productId} togglePaymentState={togglePaymentState} />
                    </div>
                </div>
            </div>
        </>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
