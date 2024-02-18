import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Login from './routes/login';
import Register from './routes/register';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])

function App() {

  return (
        <RouterProvider router={router} />
  )
}

export default App
