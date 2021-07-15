import { Pool } from 'undici';
import { HTTPDataSource, Request, RequestError } from 'apollo-datasource-http';
import { Region } from './resolvers-types';

const baseURL = 'https://js.wpengineapi.com';
const pool = new Pool(baseURL);


class HeadlessAPI extends HTTPDataSource {
  constructor() {
    super(baseURL, {
      pool,
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
    })
  }

  onError(error: Error, request: Request) {
    if (error instanceof RequestError) {
      console.log(error.request, error.response)
    }
  }

  async getRegions(options = {}) {
    const response = await this.get<{ regions: Region[] }>('/v1/regions', options);
    const regions = response.body.regions;

    return regions;
  }
}

export default HeadlessAPI;
