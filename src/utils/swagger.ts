export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Crypto Tracker API',
    version: '1.0.0',
    description: 'REST API for tracking cryptocurrency prices and wallet balances',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  paths: {
    '/status': {
      get: {
        summary: 'Health check',
        tags: ['Status'],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/currencies': {
      get: {
        summary: 'Get all currencies',
        tags: ['Currencies'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of currencies' }, '401': { description: 'Unauthorized' } },
      },
      post: {
        summary: 'Create currency',
        tags: ['Currencies'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ticker', 'name'],
                properties: {
                  ticker: { type: 'string', example: 'BTC' },
                  name: { type: 'string', example: 'Bitcoin' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
      },
    },
    '/currencies/{id}': {
      get: {
        summary: 'Get currency by id',
        tags: ['Currencies'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Currency' }, '404': { description: 'Not found' } },
      },
      put: {
        summary: 'Update currency',
        tags: ['Currencies'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ticker: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Updated' }, '404': { description: 'Not found' } },
      },
      delete: {
        summary: 'Delete currency',
        tags: ['Currencies'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '204': { description: 'Deleted' }, '404': { description: 'Not found' } },
      },
    },
    '/wallets': {
      get: {
        summary: 'Get all wallets',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of wallets' } },
      },
      post: {
        summary: 'Add wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['address', 'network'],
                properties: {
                  address: { type: 'string' },
                  network: { type: 'string', enum: ['btc', 'eth'] },
                  label: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
      },
    },
    '/wallets/{id}': {
      get: {
        summary: 'Get wallet by id',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Wallet' }, '404': { description: 'Not found' } },
      },
      put: {
        summary: 'Update wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Updated' } },
      },
      delete: {
        summary: 'Delete wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '204': { description: 'Deleted' } },
      },
    },
    '/wallets/{id}/balance': {
      get: {
        summary: 'Get wallet balance from blockchain',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Balance' }, '404': { description: 'Not found' } },
      },
    },
    '/prices/{ticker}': {
      get: {
        summary: 'Get current price',
        tags: ['Prices'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'ticker', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Price' }, '404': { description: 'Not found' } },
      },
    },
    '/prices/{ticker}/history': {
      get: {
        summary: 'Get price history',
        tags: ['Prices'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'ticker', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 100 } },
        ],
        responses: { '200': { description: 'History array' } },
      },
    },
    '/blockchain/height': {
      get: {
        summary: 'Get blockchain height',
        tags: ['Blockchain'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'query', name: 'network', schema: { type: 'string', enum: ['btc', 'eth'], default: 'btc' } }],
        responses: { '200': { description: 'Block height' }, '400': { description: 'Unsupported network' } },
      },
    },
  },
};
