import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RecoilRoot } from "recoil"
import routes from "./routes"

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
  </RecoilRoot>,
)