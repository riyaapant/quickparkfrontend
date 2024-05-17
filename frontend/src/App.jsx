import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import ForgotPassword from './routes/forgotpassword';
import ResetPassword from './routes/resetpassword'
import Message from './routes/emailverification'
import Register from './routes/register';
import Maps from './experiment/staticmap';
import SideBar from './components/Sidebar';
import Dashboard from './routes/dashboard';
import AddDocument from './components/AddDocuments';
import Profile from './components/Profile';
import Maps2 from './maps/maps';

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
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <AddDocument />
      },
      {
        path: "maps",
        element: <Maps2 />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ],
  },
  {
    path: "/sidebar",
    element: <SideBar />
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
  {
    path: "/maps",
    element: <Maps />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
