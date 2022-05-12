import { gql } from "apollo-server";
export default gql`
  type User {
    id: Int!
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
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
    photos: [Photo]
  }
`;
