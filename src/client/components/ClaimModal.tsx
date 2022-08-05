import React, { FunctionComponent, Dispatch, SetStateAction } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Modal.module.css';

export interface ClaimModalProps {
    isShown: boolean;
    hide: () => void;
}

export const ClaimModal: FunctionComponent<ClaimModalProps> = ({ isShown, hide }) => {
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
                        <h1>Claim QR code will show here</h1>
                    </div>
                </div>
            </div>
        </>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
