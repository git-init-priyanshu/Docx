import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import PrivateRoute from "./Components/PrivateRoute";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Doc from "./Components/Doc";

// eslint-disable-next-line react-refresh/only-export-components
// export const URL: string = import.meta.env.DEV
//   ? import.meta.env.VITE_DEV_URL
//   : import.meta.env.VITE_PROD_URL;

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
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: `${GraphqlURI}/graphql`,
  });
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

function Root() {
  return <Outlet />;
}

export default App;
