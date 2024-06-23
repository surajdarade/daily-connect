import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import SignUp from "../pages/SignUp";
import Home from "../components/Home";
import Message from "../components/Message";
import AuthLayout from "../layout/AuthLayout";
import Forgotpassword from "../pages/ForgotPassword";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";

// Define the routes with type annotations
const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signup",
        element: (
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "/email",
        element: (
          <AuthLayout>
            <CheckEmail />
          </AuthLayout>
        ),
      },
      {
        path: "/password",
        element: (
          <AuthLayout>
            <CheckPassword />
          </AuthLayout>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <AuthLayout>
            <Forgotpassword />
          </AuthLayout>
        ),
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: "/:userId",
            element: <Message />,
          },
        ],
      },
    ],
  },
];

// Create the router with the defined routes
const router = createBrowserRouter(routes);

export default router;
