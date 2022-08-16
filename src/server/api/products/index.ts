import { NextApiHandler } from 'next';
import { cors, rateLimit } from '../../middleware';
import products from '../../data/products.json';

interface GetResponse {
    id: string;
    name: string;
    price: string;
    description: string;
    image_url: string;
}

const get: NextApiHandler<GetResponse[]> = async (_, response) => {
    // const productsNoHashes = products.map((product) => {
    //     const { hash, filename, ...rest } = product;
    //     return rest;
    // });
    
    response.status(200).json(products);
};

const index: NextApiHandler<GetResponse[]> = async (request, response) => {
    await cors(request, response);
    await rateLimit(request, response);

    if (request.method === 'GET') return get(request, response);

    throw new Error(`Unexpected method ${request.method}`);
};

export default index;
