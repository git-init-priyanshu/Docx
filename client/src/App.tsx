import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import { Theme } from "./Theme/theme";
import PrivateRoute from "./Components/PrivateRoute";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home/Home";
import Doc from "./Components/Doc";

export const GraphqlURI: string = import.meta.env.DEV
  ? import.meta.env.VITE_GRAPHQL_DEV_URI
  : import.meta.env.VITE_GRAPHQL_PROD_URI;

function PrivateRouteElement(component: React.JSX.Element) {
  return <PrivateRoute>{component}</PrivateRoute>;
}

// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={PrivateRouteElement(<Home />)} />
      <Route path="/documents/:id" element={PrivateRouteElement(<Doc />)} />
    </Route>
  )
);

function App() {
  // Defining Apollo Client
  const httpLink = new HttpLink({
    uri: import.meta.env.PROD
      ? import.meta.env.VITE_HTTPS_URL
      : "http://localhost:4000/graphql",
  });
  const wsLink = new GraphQLWsLink(
    createClient({
      url: import.meta.env.PROD
        ? import.meta.env.VITE_WSS_URL
        : "wss://localhost:4000/graphql",
      connectionParams: {
        authToken: localStorage.getItem("token"),
      },
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });
  return (
    <ThemeProvider theme={Theme}>
      <ApolloProvider client={client}>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </ApolloProvider>
    </ThemeProvider>
  );
}

function Root() {
  return <Outlet />;
}

export default App;
