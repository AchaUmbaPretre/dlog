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
import { PacmanLoader } from 'react-spinners';
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
import TemplateForm from './pages/template/templateForm/TemplateForm';
import Template from './pages/template/Template';
import DeclarationForm from './pages/declaration/declarationForm/DeclarationForm';
import Declaration from './pages/declaration/Declaration';
import Niveau from './pages/batiment/niveau/Niveau';
import Denomination from './pages/batiment/denomination/Denomination';
import WhseFact from './pages/batiment/whseFact/WhseFact';
import TacheForm from './pages/taches/tacheform/TacheForm';
import Adresse from './pages/adresse/Adresse';
import Instructions from './pages/instructions/Instructions';
import CatInspection from './pages/catInspection/CatInspection';
import AuditLogsTache from './pages/taches/auditLogsTache/AuditLogsTache';
import Contrat from './pages/contrat/Contrat';
import RapportDeclaration from './pages/declaration/rapportDeclaration/RapportDeclaration';
import Corbeille from './pages/corbeille/Corbeille';
import RapportSpecial from './pages/rapportSpecial/RapportSpecial';
import Charroi from './pages/charroi/Charroi';
import Chauffeur from './pages/chauffeur/Chauffeur';
import Affectations from './pages/charroi/affectations/Affectations';
import Sites from './pages/charroi/sites/Sites';
import ControleTechnique from './pages/controleTechnique/ControleTechnique';

function App() {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const role = useSelector((state) => state.user?.currentUser?.role);
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
          element: <Departement datas={data} />
        },
        {
          path: '/tache',
          element: <Taches/>
        },
        {
          path: '/tache_form',
          element: <TacheForm/>
        },
        {
          path: '/liste_tracking',
          element: <ListeTrackingGlobal/>
        },
        {
          path: '/controle',
          element: <ControleDeBase datas={data}/>
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
          element: <Batiment datas={data}/>
        },
        {
          path: '/liste_bins',
          element: <ListBinGlobal/>
        },
        {
          path: '/adresse',
          element: <Adresse/>
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
          path: '/auditLogs',
          element: <AuditLogsTache/>
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
          path: '/niveau',
          element: <Niveau/>
        },
        {
          path: '/denomination',
          element: <Denomination/>
        },
        {
          path: '/whseFact',
          element: <WhseFact/>
        },
        {
          path: '/liste_inspection',
          element: <Instructions/>
        },
        {
          path: '/liste_template',
          element: <Template datas={data} />
        },
        {
          path: '/template_form',
          element: <TemplateForm/>
        },
        {
          path: '/liste_declaration',
          element: <Declaration/>
        },
        {
          path: '/declaration_form',
          element: <DeclarationForm/>
        },
        {
          path: '/declaration',
          element: <Declaration/>
        },
        {
          path: '/liste_cat_inspection',
          element: <CatInspection/>
        },
        {
          path: '/utilisateur',
          element: <Users/>
        },
        {
          path: '/profile',
          element: <Profile/>
        },
        {
          path: '/contrat',
          element: <Contrat/>
        },
        {
          path: '/rapport_declaration',
          element: <RapportDeclaration/>
        },
        {
          path: '/corbeille',
          element: <Corbeille/>
        },
        {
          path: '/rapport_special',
          element: <RapportSpecial/>
        },
        {
          path: '/liste_vehicule',
          element: <Charroi/>
        },
        {
          path: '/liste_chauffeur',
          element: <Chauffeur/>
        },
        {
          path: '/liste_affectation',
          element: <Affectations/>
        },
        {
          path: '/liste_site',
          element: <Sites/>
        },
        {
          path: '/controle_technique',
          element: <ControleTechnique/>
        },
        {
          path: '/liste_reparation',
          element: <ControleTechnique/>
        }
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/password_forgot', element: <PasswordForgot /> },
    { path: '/reset-password/:id', element: <PasswordReset /> }
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
