// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { subscribeToNewMessages } from '../../api/subscriptions';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';
import {
  directMessageGroupInfoFragment,
} from '../../api/fragments/directMessageGroup/directMessageGroupInfo';

export const GET_DIRECT_MESSAGE_GROUP_QUERY = gql`
  query getDirectMessageGroupMessages($id: ID!) {
    directMessageGroup(id: $id) {
      ...directMessageGroupInfo
      users {
        ...userInfo
      }
      messageConnection {
        edges {
          node {
            ...messageInfo
          }
        }
      }
    }
  }
  ${directMessageGroupInfoFragment}
  ${userInfoFragment}
  ${messageInfoFragment}
`;

export const GET_DIRECT_MESSAGE_GROUP_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({
    data: { error, loading, directMessageGroup, subscribeToMore },
    ownProps,
  }) => ({
    data: {
      error,
      loading,
      messages: directMessageGroup
        ? directMessageGroup.messageConnection.edges
        : '',
    },
    subscribeToNewMessages: () => {
      if (!directMessageGroup) {
        return;
      }
      return subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;
          // Add the new message to the data
          return {
            ...prev,
            directMessageGroup: {
              ...prev.directMessageGroup,
              messageConnection: {
                ...prev.directMessageGroup.messageConnection,
                edges: [
                  ...prev.directMessageGroup.messageConnection.edges,
                  // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
                  {
                    node: newMessage,
                    __typename: 'DirectMessageGroupMessageEdge',
                  },
                ],
              },
            },
          };
        },
      });
    },
  }),
};

export const getDirectMessageGroupMessages = graphql(
  GET_DIRECT_MESSAGE_GROUP_QUERY,
  GET_DIRECT_MESSAGE_GROUP_OPTIONS
);