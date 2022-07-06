import React, { FunctionComponent , Dispatch, SetStateAction} from 'react';
import ReactDOM from 'react-dom';
import styles from "../styles/Modal.module.css";
import { Buy } from './Buy';

export interface ModalProps {
    isShown: boolean;
    hide: () => void;
    togglePaymentState : ( val : boolean) => void;
    productId : number;
}

export const Modal: FunctionComponent<ModalProps> = ({
    isShown,
    hide,
    togglePaymentState,
    productId,

}) => {
    const modal = (
        <>
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
                        <Buy itemID={productId} togglePaymentState={togglePaymentState}/>
                    </div>
                </div>
            </div>
        </>
    );

    return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
