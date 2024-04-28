import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import Register from './routes/register';
import UserProfile from './routes/UserProfile';
import ForgotPassword from './routes/forgotpassword';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/profile",
    element: <UserProfile />
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />
  }
])

function App() {

  return (
        <RouterProvider router={router} />
  )
}

export default App
