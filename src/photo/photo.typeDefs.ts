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
    likes: Int
    isMine: Boolean!
    comments: Int
  }

  type Hashtag {
    createdAt: String!
    updatedAt: String!
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
  }

  type Like {
    createdAt: String!
    updatedAt: String!
    id: Int!
    photo: Photo!
  }
`;
