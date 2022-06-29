const useIPFS = (hash: string, filename: string) => {
    return `https://gateway.ipfscdn.io/ipfs/${hash}?filename=${filename}`;
};
export default useIPFS;
