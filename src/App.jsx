import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Menu, { pizzaMenuFetch } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order, { orderFetch } from "./features/order/Order";
import CreateOrder, { createOrderAction } from "./features/order/CreateOrder";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, //here error will bubble up if no error occurs in child route this redirect to error page
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: pizzaMenuFetch,
        errorElement: <Error />, //this error appear in the component not redirect to error page
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderFetch,
        errorElement: <Error />, //this error appear in the component not redirect to error page
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
