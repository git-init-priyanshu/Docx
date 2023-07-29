import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import TextEditor from "./Components/Doc";
import Home from "./Components/Home";
// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="/documents/:id" element={<TextEditor />} />
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
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
