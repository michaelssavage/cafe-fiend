import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar } from '../Components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})