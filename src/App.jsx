import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Provider, useSelector } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { store, persistor } from "./store"

import Home from "./pages/Home"

import DetailRecipe from "./pages/DetailRecipe"
import { MainContextProvider } from "./context/main/main-context-provider"
import MainLayout from "./layout/MainLayout"


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/add-recipe",
//     element: <AddRecipe />,
//   },
//   {
//     path: "/profile",
//     element: <Profile />,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/code-reset-password",
//     element: <CodeResetPassword />,
//   },
//   {
//     path: "/reset-password",
//     element: <ResetPassword />,
//   },
//   {
//     path: "/registration",
//     element: <Registration />,
//   },
//   {
//     path: "/detail-recipe/:slug",
//     element: <DetailRecipe />,
//   },
//   {
//     path: "/detail-video-step/:id",
//     element: <DetailVideoStep />,
//   },
//   {
//     path: "/edit-profile",
//     element: <EditProfile />,
//   },
//   {
//     path: "/edit-recipe/:id",
//     element: <EditRecipe />,
//   },
// ])

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "detail-recipe/:slug",
        element: <DetailRecipe />,
      },
    ],
  },
])

function App() {
  return (
    <div>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        {/* <Provider store={store}> */}
        <MainContextProvider>
          <RouterProvider router={router} />
        </MainContextProvider>
        {/* </Provider> */}
      {/* </PersistGate> */}
    </div>
  )
}

export default App

