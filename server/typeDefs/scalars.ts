import { gql } from "apollo-server-express";

export const scalars = gql`
  scalar ObjectId

  scalar Date

  scalar JSON
`;
