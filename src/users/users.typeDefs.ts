import { gql } from "apollo-server";
export default gql`
  type User {
    id: String!
    createdAt: String!
    updatedA: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    avatar: String
    followers: [User]
    following: [User]
  }
`;
