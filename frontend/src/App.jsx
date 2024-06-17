import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/shared/login';
import ForgotPassword from './routes/shared/forgotpassword';
import ResetPassword from './routes/shared/resetpassword'
import Message from './routes/shared/emailverification'
import Register from './routes/shared/register';
import SideBar from './components/customer/Sidebar.jsx';
import UserDashboard from './routes/customer/userdashboard.jsx';
import AddDocument from './components/customer/AddDocuments.jsx';
import Profile from './components/shared/Profile';
import Maps from './components/customer/maps/maps.jsx';
import AutoComplete from './components/customer/maps/viewparking.jsx';

import OwnerDashboard  from './routes/owner/ownerdashboard.jsx';
import AddOwnerDocument from './components/owner/AddOwnerDocuments.jsx';
import AddParking from './components/owner/AddParking.jsx';
import OwnerMaps from './components/owner/maps/OwnerMap.jsx';
import ViewParkingLocationsOnMap from './components/owner/maps/locationsmap.jsx';
import ViewOwnParking from './components/owner/viewOwnParking.jsx';

import AdminDashboard from './routes/admin/Dashboard';
import PendingRequests from './components/admin/Requests.jsx';
import UserDetails from './components/admin/UserProfile';
import EditProfile from './components/shared/EditProfile.jsx';
import ChangePassword from './components/shared/ChangePassword.jsx';
import KhaltiCheckout from './experiment/khalti.jsx';
import AdminRegistration from './routes/admin/adminregistration.jsx';
import AdminLogin from './routes/admin/adminlogin.jsx';
import ViewUsers from './components/admin/Users.jsx'
import ReserveParking from './components/customer/ReserveParking.jsx';

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
    element: <UserDashboard />,
    children: [
      {
        path: "",
        element: <AddDocument />
      },
      {
        path: "maps",
        element: <AutoComplete />
        // element: <Maps />
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
      },
      {
        path:"reserveparking",
        element: <ReserveParking />
      }
    ],
  },
  {
    path: "/owner/dashboard",
    element: <OwnerDashboard />,
    children: [
      {
        path: "",
        element: <AddOwnerDocument />
      },
      {
        path: "parkinglocations",
        element: <ViewOwnParking />
      },
      {
        path: "parkinglocations/map",
        element: <ViewParkingLocationsOnMap />
      },
      {
        path: "maps",
        element: <OwnerMaps />
      },
      {
        path: "addparking",
        element: <AddParking />
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
      {
        path: "viewusers",
        element: <ViewUsers />
      },
      {
        path: "maps",
        element: <AutoComplete />
      },
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
  },
  {
    path: "/admin/register",
    element: <AdminRegistration />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
