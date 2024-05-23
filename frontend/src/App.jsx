import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import ForgotPassword from './routes/forgotpassword';
import ResetPassword from './routes/resetpassword'
import Message from './routes/emailverification'
import Register from './routes/register';
import SideBar from './components/Sidebar';
import Dashboard from './routes/dashboard';
import AddDocument from './components/AddDocuments';
import Profile from './components/Profile';
import Maps from './maps/maps';
import AutoComplete from './maps/autocomplete';
import MapSearch from './experiment/MapSearch';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapSearch />
  },
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
      // {
      //   path: "maps",
      //   element: <Maps />
      // },
      {
        path: "maps",
        element: <AutoComplete />
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
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
