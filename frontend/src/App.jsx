import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import UserProfile from './routes/UserProfile';
import ForgotPassword from './routes/forgotpassword';
import ResetPassword from './routes/resetpassword'
import Message from './routes/emailverification'
import Register from './routes/register';
// import Maps from './maps/staticmap';

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
  },
  {
    path: "/reset/:uid/:token",
    element: <ResetPassword />
  },
  {
    path: "/verify/:uid/:token",
    element: <Message />
  },
  // {
  //   path: "/",
  //   element: <Maps />
  // }
])

function App() {

  return (
        <RouterProvider router={router} />
  )
}

export default App
