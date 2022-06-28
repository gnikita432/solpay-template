import React  from 'react';
import useIPFS from '../hooks/useIPFS';
import styles from "../styles/HomePage.module.css"
type Props = {
  hash: string,
  filename: string,
}

const IPFSDownload = ({ hash, filename }: Props) => {

  const file = useIPFS(hash, filename);

  return (
    <div>
      {file ? (
        <div>
          <a className={styles.downloadButton} href={file} download={filename}>Download</a>
        </div>
      ) : (
        <p>Downloading file...</p>
      )}
    </div>
  );
};

export default IPFSDownload;
