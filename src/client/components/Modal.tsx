import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from "../styles/Modal.module.css";

export interface ModalProps {
    isShown: boolean;
    hide: () => void;
}

export const Modal: FunctionComponent<ModalProps> = ({
    isShown,
    hide,

}) => {
    const modal = (
        <React.Fragment>
            <div className={styles.backdrop}></div>
            <div className={styles.wrapper} >
                <div className={styles.styledModal}>
                    <div className={styles.header}>
                        <div className={styles.headerText}>Payment Method</div>
                        <button className={styles.closeButton} onClick={hide}>X</button>
                    </div>
                    <div>
                        <button className={styles.content} >Pay using QR CODE</button>
                        <p className={styles.option}>OR</p>
                        <button className={styles.content}>Pay using WALLET EXTENSION</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};