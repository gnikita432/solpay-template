import React from "react";
import styles from "../styles/Product.module.css";
import IPFSDownload from './IpfsDownload';

type Props = {
  product: {
    "id": number;
    "name": string;
    "price": string;
    "description":string;
    "image_url":string;
    "filename":string;
    "hash":string;
  };
}

export default function Product({ product }: Props) {
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.productContainer}>
      <div >
        <img className={styles.productImage}src={image_url} alt={name} />
      </div>

      <div className={styles.productDetails}>
        <div className={styles.productText}>
          <div className={styles.productTitle}>{name}</div>
          <div className={styles.productDescription}>{description}</div>
        </div>

        <div className={styles.productAction}>
          <div className={styles.productPrice}>{price} USDC</div>
          {/* I'm hardcoding these for now, we'll fetch the hash from the API later*/}
          <IPFSDownload filename="spiderman-comic.pdf" hash="QmbXt9KQzeadh5iFjXKkxXMhsv4AbvMVX7jedomZr1hAmH"/>
        </div>
      </div>
    </div>
  );
}