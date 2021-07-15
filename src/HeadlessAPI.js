const {Pool} = require('undici');
const {HTTPDataSource, RequestError} = require('apollo-datasource-http');

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

  // onCacheKeyCalculation(request) {
  //   // return different key based on request options
  //   // console.log('onCacheKeyCalculation', request)
  // }

  // async onRequest(request) {
  //   // manipulate request before it is send
  //   // for example assign a AbortController signal to all requests and abort

  //   // console.log('onRequest', request)

  //   // request.signal = this.context.abortController.signal

  //   // setTimeout(() => {
  //   //   this.context.abortController.abort()
  //   // }, 3000).unref()
  // }

  // onResponse(request, response) {
  //   // console.log('onResponse', request, response)

  //   // manipulate response or handle unsuccessful response in a different way
  //   return super.onResponse(request, response)
  // }

  onError(error, request) {
    console.log('onError', request, error)
    // in case of a request error
    if (error instanceof RequestError) {
      console.log(error.request, error.response)
    }
  }

  async getRegions(options = {}) {
    const response = await this.get('/v1/regions', options);
    const regions = response.body.regions;

    return regions;
  }
}

module.exports = HeadlessAPI;
