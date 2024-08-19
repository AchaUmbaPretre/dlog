import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import TopBar from './components/topbar/TopBar';
import SideBar from './components/sidebar/SideBar';
import RightBar from './pages/rightBar/RightBar';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Departement from './pages/departement/Departement';
import Client from './pages/client/Client';

function App() {
  const [currentUser, setCurrentUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const SecureRoute = ({ children }) => (
    !currentUser ? <Navigate to="/login" /> : children
  );

  const Layout = () => (
    <div className='app-rows'>
      <TopBar />
      <div className="app-container">
        <SideBar />
        <div className="app-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );

  const router = createBrowserRouter([
    {
      path: '/',
      element: <SecureRoute><Layout /></SecureRoute>,
      children: [
        { 
          path: '/', 
          element: <RightBar /> 
        },
        {
          path: '/client',
          element: <Client/>
        },
        {
          path: '/departement',
          element: <Departement/>
        },
        {
          path: '/form_tache',
          element: <Departement/>
        },
        {
          path: '/controle',
          element: <Departement/>
        },
        {
          path: '/format',
          element: <Departement/>
        },
        {
          path: '/frequence',
          element: <Departement/>
        },
        {
          path: '/besoin',
          element: <Departement/>
        },
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
