import { Pool } from 'undici';
import { HTTPDataSource, Request, RequestError } from 'apollo-datasource-http';
import { App, Region } from './resolvers-types';

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

  async getRegion(name: string, options = {}) {
    const regions = await this.getRegions(options);
    const region = regions.find(region => region.name === name);

    return region as Region;
  }
  
  async getApps(accountName: string, options = {}) {
    const response = await this.get<{ apps: App[] }>(`/v1/accounts/${accountName}/apps`, options);
    const regions = await this.getRegions(options);

    const apps = response.body.apps.map(app => {
      const region = regions.find(region => region.name === app.region as string);

      return {
        ...app,
        displayName: app.name?.split('/').pop(),
        region
      }
    })
    return apps;
  }

  async getApp(accountName: string, appName: string, options = {}) {
    const response = await this.get<App>(`/v1/accounts/${accountName}/apps/${appName}`, options);

    return response.body;
  }
}

export default HeadlessAPI;
