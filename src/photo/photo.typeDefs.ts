import { gql } from "apollo-server";
export default gql`
  type Photo {
    createdAt: String!
    updatedAt: String!
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
  }

  type Hashtag {
    createdAt: String!
    updatedAt: String!
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
  }
`;
