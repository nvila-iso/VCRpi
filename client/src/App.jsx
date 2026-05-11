import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout.jsx";
import MainPage from "./pages/MainPage.jsx";

const routes = [
  {
    path: "/",
    Component: RootLayout,
    children: [{ index: true, Component: MainPage }],
  },
];

const App = createBrowserRouter(routes);
export default App;
