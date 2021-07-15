import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';

import HeadlessAPI from './HeadlessAPI';
import schema from './schema';
import { DocumentNode } from 'graphql';
import { Resolvers } from './resolvers-types';
import resolvers from './resolvers';

const startApolloServer = async (typeDefs: DocumentNode, resolvers: Resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req }) => {
      const token = req.headers.authorization || '';

      return {
        headers: {
          authorization: token
        }
      };
    },
    dataSources: () => ({
      headlessAPI: new HeadlessAPI(),
    }),
  });

  await server.start();
  const app = express();

  app.get('/', (req, res) => res.send('healthy'));

  server.applyMiddleware({
    app,
    path: '/graphql'
  });

  await new Promise<void>(resolve => app.listen({
    port: 8080
  }, resolve));

  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
}



startApolloServer(schema, resolvers);
