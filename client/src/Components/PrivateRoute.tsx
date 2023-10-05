import React from "react";

import { useIsAuth } from "../hooks/useIsAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
}
