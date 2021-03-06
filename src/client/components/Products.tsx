import React, { FC, useState } from 'react';
import styles from '../styles/Product.module.css';
import IPFSDownload from './IpfsDownload';
import { Modal } from '../components/Modal';
import { useModal } from '../components/useModal';
import Image from 'next/image';

interface IProp {
    product: {
        id: number;
        name: string;
        price: string;
        description: string;
        image_url: string;
        filename: string;
        hash: string;
    };
}

const Product: FC<IProp> = ({ product }) => {
    const { id, name, price, description, image_url } = product;
    const { isShown, toggle } = useModal();
    const [showPaid, setShowPaid] = useState<boolean>(true);

    return (
        <div className={styles.productContainer}>
            <div>
                <Image height={200} width={160} className={styles.productImage} src={image_url} alt={name} />
            </div>

            <div className={styles.productDetails}>
                <div className={styles.productText}>
                    <div className={styles.productTitle}>{name}</div>
                    <div className={styles.productDescription}>{description}</div>
                </div>

                <div className={styles.productAction}>
                    <div className={styles.productPrice}>{price} USDC</div>
                    {/* I'm hardcoding these for now, we'll fetch the hash from the API later*/}
                    {showPaid ? (
                        <div>
                            <button onClick={toggle} className={styles.buyButton}>
                                PAY
                            </button>
                            <Modal
                                isShown={isShown}
                                hide={toggle}
                                togglePaymentState={setShowPaid}
                                price={price}
                                productId={id}
                                name={name}
                                description={description}
                            />
                        </div>
                    ) : (
                        <IPFSDownload
                            filename="spiderman-comic.zip"
                            hash="QmTAEowJmKNUiP6sBkJ7yFinX6ZCBfN9duwWtsmz89G9kR"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default Product;
