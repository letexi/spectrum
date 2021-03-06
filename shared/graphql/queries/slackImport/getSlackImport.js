// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type GetSlackImportType = {
  id: string,
  slug: string,
  slackImport: {
    members: string,
    teamName: string,
    sent: Date,
  },
};

export const getSlackImportQuery = gql`
  query getSlackImport($id: ID!) {
    community(id: $id) {
      id
      slug
      slackImport {
        members
        teamName
        sent
      }
    }
  }
`;

const getSlackImportOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getSlackImportQuery, getSlackImportOptions);
