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
  }

  type loginResult {
    ok: Boolean!
    token: String
    error: String
  }

  type Query {
    seeProfile(username: String!): User
  }

  type Mutation {
    createAccount(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): User
    login(username: String!, password: String!): loginResult!
  }
`;
