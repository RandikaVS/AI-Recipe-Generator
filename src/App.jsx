import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"



import Home from "./pages/Home"

import { MainContextProvider } from "./context/main"
import MainLayout from "./layout/MainLayout"
import { Suspense } from "react"
import SplashScreen from "./components/SplashScreen"



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      }
    ],
  },
])

function App() {
  return (
    <div>
      <MainContextProvider>
        <Suspense fallback={<SplashScreen/>}>
          <Outlet/>
          <RouterProvider router={router} />
        </Suspense>
      </MainContextProvider>
       
    </div>
  )
}

export default App

