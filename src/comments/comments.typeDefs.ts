import { gql } from "apollo-server";
export default gql`
  type Comment {
    createdAt: String!
    updatedAt: String!
    id: Int!
    user: User!
    photo: Photo!
    payload: String!
    isMine: Boolean!
  }
`;
