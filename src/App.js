import { useCallback, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import TopBar from './components/topbar/TopBar';
import SideBar from './components/sidebar/SideBar';
import RightBar from './pages/rightBar/RightBar';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Departement from './pages/departement/Departement';
import Client from './pages/client/Client';
import Taches from './pages/taches/Taches';
import Users from './pages/users/Users';
import ControleDeBase from './pages/controleDeBase/ControleDeBase';
import Format from './pages/format/Format';
import Frequence from './pages/frequence/Frequence';
import Budget from './pages/budget/Budget';
import Projet from './pages/projet/Projet';
import Fournisseur from './pages/fournisseur/Fournisseur';
import Offres from './pages/offres/Offres';
import { useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners'; // ou tout autre spinner de votre choix
import { Spin } from 'antd';
import Batiment from './pages/batiment/Batiment';
import Article from './pages/article/Article';
import Categorie from './pages/categorie/Categorie';
import Dossier from './pages/dossier/Dossier';
import { MenuProvider } from './context/MenuProvider';
import Besoins from './pages/besoins/Besoins';
import Stock from './pages/stock/Stock';
import ListBinGlobal from './pages/listeBinGlobal/ListBinGlobal';
import ListeEquipementGlobal from './pages/listeEquipementGlobal/ListeEquipementGlobal';
import ListeTrackingGlobal from './pages/listeTrackingGlobal/ListeTrackingGlobal';
import EntrepotListeGlobale from './pages/entrepotListeGlobal/EntrepotListeGlobal';
import ListBureaux from './pages/Listbureaux/ListBureaux';
import Tags from './pages/tags/Tags';
import CorpsMetier from './pages/corpsMetier/CorpsMetier';
import ListCatTache from './pages/listCatTache/ListCatTache';
import ListePrix from './pages/prix/ListePrix';
import Permission from './pages/permission/Permission';
import { getMenusAllOne } from './services/permissionService';
import Profile from './pages/profile/Profile';
import PasswordForgot from './pages/passwordForgot/PasswordForgot';
import PasswordReset from './pages/passwordReset/PasswordReset';

function App() {
  const [currentUser, setCurrentUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user?.currentUser);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [data, setData] = useState([]);


  const SecureRoute = ({ children }) => {
    if (!userId) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMenusAllOne(userId);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [userId, fetchMenu]);


  const Layout = () => (
    <div className='app-rows'>
      <TopBar />
      <div className="app-container">
        <SideBar data = {data} />
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
          path: '/tache',
          element: <Taches/>
        },
        {
          path: '/liste_tracking',
          element: <ListeTrackingGlobal/>
        },
        {
          path: '/controle',
          element: <ControleDeBase/>
        },
        {
          path: '/format',
          element: <Format/>
        },
        {
          path: '/frequence',
          element: <Frequence/>
        },
        {
          path: '/permission',
          element: <Permission/>
        },
        {
          path: '/Projet',
          element: <Projet/>
        },
        {
          path: '/offre',
          element: <Offres/>
        },
        {
          path: '/budget',
          element: <Budget/>
        },
        {
          path: '/besoins',
          element: <Besoins/>
        },
        {
          path: '/fournisseur',
          element: <Fournisseur/>
        },
        {
          path: '/batiment',
          element: <Batiment/>
        },
        {
          path: '/liste_bins',
          element: <ListBinGlobal/>
        },
        {
          path: '/liste_equipement',
          element: <ListeEquipementGlobal/>
        },
        {
          path: '/liste_entrepot',
          element: <EntrepotListeGlobale/>
        },
        {
          path: '/liste_bureaux',
          element: <ListBureaux/>
        },
        {
          path: '/dossier',
          element: <Dossier/>
        },
        {
          path: '/tags',
          element: <Tags/>
        },
        {
          path: '/article',
          element: <Article/>
        },
        {
          path: '/prix',
          element: <ListePrix/>
        },
        {
          path: '/stock',
          element: <Stock/>
        },
        {
          path: '/categorie',
          element: <Categorie/>
        },
        {
          path: '/liste_cat_tache',
          element: <ListCatTache/>
        },
        {
          path: '/corpsMetier',
          element: <CorpsMetier/>
        },
        {
          path: '/utilisateur',
          element: <Users/>
        },
        {
          path: '/profile',
          element: <Profile/>
        },
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/password_forgot', element: <PasswordForgot /> },
    { path: '/reset-password', element: <PasswordReset /> }
  ]);

  return (
    <MenuProvider>
    {loading ? (
      <div className="spinnerContainer">
        <PacmanLoader color="rgb(131, 159, 241)" loading={loading} height={15} radius={2} margin={2} />
      </div>
    ) : (
      <div>
        <RouterProvider router={router} />
      </div>
    )}
    </MenuProvider>
  );
}

export default App;
