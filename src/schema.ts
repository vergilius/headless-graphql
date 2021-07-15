import { gql } from 'apollo-server-express';

const schema = gql`
  type Region {
    name: String
    displayName: String
  }

  type Query {
    regions: [Region]
  }
`;

export default schema;
