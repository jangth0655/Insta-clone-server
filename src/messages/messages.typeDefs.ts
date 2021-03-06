import { gql } from "apollo-server";
export default gql`
  type Message {
    id: Int!
    createdAt: String!
    updatedA: String!
    payload: String!
    users: User!
    room: Room!
    read: Boolean!
  }
  type Room {
    id: Int!
    createdAt: String!
    updatedA: String!
    users: [User]
    messages: [Message]
    unreadTotal: Int!
  }
`;
