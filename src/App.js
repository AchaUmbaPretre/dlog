import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import TopBar from './components/topbar/TopBar';
import SideBar from './components/sidebar/SideBar';

function App() {
  const [currentUser, setCurrentUser] = useState(true);

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


  return (
    <>
      
    </>
  );
}

export default App;
