import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/shared/login';
import ForgotPassword from './routes/shared/forgotpassword';
import ResetPassword from './routes/shared/resetpassword'
import Message from './routes/shared/emailverification'
import Register from './routes/shared/register';
import SideBar from './components/shared/Sidebar';
import Dashboard from './routes/shared/dashboard';
import AddDocument from './components/AddDocuments';
import Profile from './components/shared/Profile';
import Maps from './maps/maps';
import AutoComplete from './maps/autocomplete';

import AdminDashboard from './routes/admin/Dashboard';
import PendingRequests from './components/admin/Requests';
import UserDetails from './components/admin/UserProfile';
import EditProfile from './components/shared/EditProfile.jsx';
import ChangePassword from './components/shared/ChangePassword.jsx';
import KhaltiCheckout from './experiment/khalti.jsx';

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
        element: <Maps />
      },
      {
        path: "maps/viewparking",
        element: <AutoComplete />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "profile/edit",
        element: <EditProfile />
      },
      {
        path: "profile/changepassword",
        element: <ChangePassword />
      }
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    children: [
      {
        path: "",
        element: <PendingRequests />
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
        path: "userprofile",
        element: <UserDetails />
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
    path: "/khalti",
    element: <KhaltiCheckout />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
