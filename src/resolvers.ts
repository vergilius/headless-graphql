import HeadlessAPI from "./HeadlessAPI";
import { Resolvers } from "./resolvers-types";

const resolvers: Resolvers<{
  dataSources: {
    headlessAPI: HeadlessAPI
  },
  headers: Record<string, string>
}> = {
  Query: {
    regions: async (_, __, { dataSources, headers }) => {
      return dataSources.headlessAPI.getRegions({ headers });
    },
  },
};

export default resolvers;
