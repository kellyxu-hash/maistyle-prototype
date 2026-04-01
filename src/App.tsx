import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { StudioPage } from "./pages/StudioPage";
import { BrandPage } from "./pages/BrandPage";
import { ExportsPage } from "./pages/ExportsPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "projects", Component: ProjectsPage },
      { path: "project/:projectId", Component: StudioPage },
      { path: "brand", Component: BrandPage },
      { path: "exports", Component: ExportsPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
