import { gql } from 'apollo-server-express';

const schema = gql`
  type Region {
    name: String
    displayName: String
  }

  type GithubRepository {
    owner: String
    name: String
  }

  type App {
    name: String
    displayName: String
    github: GithubRepository
    region: Region
    createTime: String
  }

  type Query {
    Regions: [Region]
    Apps(accountName: String!): [App]
  }
`;

export default schema;
