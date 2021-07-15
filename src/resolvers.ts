import HeadlessAPI from "./HeadlessAPI";
import { Resolvers } from "./resolvers-types";

type Context = {
  dataSources: {
    headlessAPI: HeadlessAPI
  },
  headers: Record<string, string>
};

const resolvers: Resolvers<Context> = {
  Query: {
    Regions: async (_, __, { dataSources, headers }) => {
      return dataSources.headlessAPI.getRegions({ headers });
    },
    Apps: async (_, {accountName}, { dataSources, headers }) => {
      return dataSources.headlessAPI.getApps(accountName, { headers });
    },
  },
  // App: {
  //   region: (app, _, { dataSources, headers }) => {
  //     return dataSources.headlessAPI.getRegion(app.region, { headers });
  //   }
  // }
  // Region: async (_, __, { dataSources, headers }) => {
  //   // return dataSources.headlessAPI.getRegion(parent.name, { headers });
  //   return dataSources.headlessAPI.getRegions({ headers })[0];
  // },
};

export default resolvers;
