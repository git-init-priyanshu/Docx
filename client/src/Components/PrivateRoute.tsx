import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { FIND_USER_QUERY } from "../Graphql/queries";

export default function PrivateRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const token = localStorage.getItem("token");
  const { data, error } = useQuery(FIND_USER_QUERY, {
    variables: {
      token,
    },
  });
  if (data?.findUser) return children;
  if (error) return <Navigate to="/" />;
}
