import { NextApiHandler } from 'next'

interface GetResponse {
  message: string
}

interface PostResponse {
  message: string
}

const index: NextApiHandler<GetResponse | PostResponse> = async (
  request,
  response
) => {
  if (request.method === 'GET') {
    return response.status(200).send({
      message: 'GET Request successful',
    })
  }

  if (request.method === 'POST') {
    return response.status(200).send({
      message: 'POST Request successful',
    })
  }

  throw new Error(`Unexpected method ${request.method}`)
}

export default index
