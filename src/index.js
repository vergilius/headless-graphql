const {
  ApolloServer,
  gql
} = require('apollo-server-express');
const express = require('express');
const {
  ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core');

const HeadlessAPI = require('./HeadlessAPI');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql `
  type Region {
    name: String
    displayName: String
  }

  type Query {
    regions: [Region]
  }
`;
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    regions: async (_, __, { dataSources, headers }) => {
      return dataSources.headlessAPI.getRegions({headers});
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {

  // Same ApolloServer initialization as before
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({req}) => {
      const token = req.headers.authorization || '';
      
      return {
        headers: {
          authorization: token
        }
      };
    },
    dataSources: () => {
      return {
        headlessAPI: new HeadlessAPI(),
      };
    },
  });

  // Required logic for integrating with Express
  await server.start();
  const app = express();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: '/'
  });

  // Modified server startup
  await new Promise(resolve => app.listen({
    port: 4000
  }, resolve));
  
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
