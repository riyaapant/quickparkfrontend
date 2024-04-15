import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import Register from './routes/register';
import UserProfile from './routes/UserProfile';


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
  }
])

function App() {

  return (
        <RouterProvider router={router} />
  )
}

export default App
