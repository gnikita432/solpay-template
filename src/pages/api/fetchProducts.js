import products from "./products.json"

export default function handler(req, res) {
    
  if (req.method === "GET") {
    // Create a copy of products without the hashes and filenames
    // hash and file name are not returned as they should not be shared with the users
    const productsNoHashes = products.map((product) => {

      const { hash, filename, ...rest } = product;
      return rest;
    });

    res.status(200).json(productsNoHashes);  
  }
  else {
    // onlu get methods are allowed
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}