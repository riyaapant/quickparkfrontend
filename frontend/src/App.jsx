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
import PaymentHandler from './components/customer/PaymentHandler.jsx';

import OwnerDashboard from './routes/owner/ownerdashboard.jsx';
// import AddOwnerDocument from './components/owner/AddOwnerDocuments.jsx';
import AddParking from './components/owner/AddParking.jsx';
import OwnerMaps from './components/owner/maps/OwnerMap.jsx';
import ViewParkingLocationsOnMap from './components/owner/maps/locationsmap.jsx';
import ViewOwnParking from './components/owner/viewOwnParking.jsx';
import History from './components/customer/History.jsx';
import ReservationHistory from './components/owner/ReservationHistory.jsx';

import AdminDashboard from './routes/admin/Dashboard';
import PendingRequests from './components/admin/Requests.jsx';
// import UserDetails from './components/admin/UserProfile';
import EditProfile from './components/shared/EditProfile.jsx';
import ChangePassword from './components/shared/ChangePassword.jsx';
import AdminRegistration from './routes/admin/adminregistration.jsx';
import AdminLogin from './routes/admin/adminlogin.jsx';
import ViewUsers from './components/admin/Users.jsx'
import Topup from './components/customer/Topup.jsx';
import Dashboard from './components/owner/Dashboard.jsx';
import ParkingStats from './components/owner/ParkingStats.jsx';
import ViewSurveillance from './components/owner/viewSurveillance.jsx';
import AdminViewSurveillance from './components/admin/viewSurveillance.jsx';

import PrivateRoute from './features/PrivateRoute.jsx';

import Surveillance from './components/shared/Surveillance.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
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
    path: "/return_url",
    element: <PaymentHandler />
  },
  {
    path: "/auth",
    element: <PrivateRoute />
    // element: <AuthProvider />
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
        element: <Maps />
      },
      {
        path: "maps/viewparking",
        element: <AutoComplete />
      },
      {
        path: "topup",
        element: <Topup />
      },
      {
        path: "history",
        element: <History />
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
    path: "/owner/dashboard",
    element: <OwnerDashboard />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "parkinglocations",
        element: <ViewOwnParking />
      },
      {
        path: "history",
        element: <ParkingStats />
      },
      {
        path: "history/:id",
        element: <ReservationHistory />
      },
      {
        path: "surveillance",
        element: <ViewSurveillance />
      },
      {
        path: "surveillance/:id",
        element: <Surveillance />
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
    element: <PrivateRoute element={<AdminDashboard />} role={'admin'} />,
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
      {
        path: "surveillance",
        element: <AdminViewSurveillance />
      },
      {
        path: "surveillance/:id",
        element: <Surveillance />
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
