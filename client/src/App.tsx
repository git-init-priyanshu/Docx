import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./Components/PrivateRoute";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Doc from "./Components/Doc";

// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <PrivateRoute>
            <Doc />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

function Root() {
  return <Outlet />;
}

export default App;
