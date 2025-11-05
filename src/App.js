import { useEffect } from 'react';
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
import { useMenu } from './context/MenuProvider';
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
import Marque from './pages/marque/Marque';
import TypeReparation from './pages/typeReparation/TypeReparation';
import Piece from './pages/piece/Piece';
import Page404 from './pages/page404/Page404';
import { secure } from './utils/secure';
import Localisation from './pages/Transporteur/localisation/Localisation';
import DemandeVehicule from './pages/charroi/demandeVehicule/DemandeVehicule';
import Pays from './pages/pays/Pays';
import Securite from './pages/charroi/securite/Securite';
import DemandeurVehicule from './pages/charroi/demandeurVehicule/DemandeurVehicule';
import Generale from './pages/generale/Generale';
import ModeTv from './pages/modeTv/ModeTv';
import Monitoring from './pages/charroi/monitoring/Monitoring';
import Geofences from './pages/administration/geofences/Geofences';
import Carburant from './pages/charroi/carburant/Carburant';

function App() {
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const { dataPermission, fetchMenu, isLoading, setIsLoading } = useMenu()

  const SecureRoute = ({ children }) => {
    if (!userId) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  
  useEffect(() => {
    const handleReconnect = () => {
      if (userId) {
        fetchMenu();
      }
    };
  
    window.addEventListener('online', handleReconnect);
  
    if (userId) {
      fetchMenu();
    } else {
      setIsLoading(false);
    }
  
    return () => {
      window.removeEventListener('online', handleReconnect);
    };
  }, [userId, fetchMenu]);

  const Layout = () => (
    <div className='app-rows'>
      <TopBar />
      <div className="app-container">
        <SideBar data = {dataPermission} />
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
          element: secure('/client', <Client/>)
        },
        {
          path: '/departement',
          element: secure('/departement', <Departement datas={dataPermission} />)
        },
        {
          path: '/tache',
          element: secure('/tache', <Taches/>)
        },
        {
          path: '/tache_form',
          element: secure('/tache_form', <TacheForm/>)
        },
        {
          path: '/liste_tracking',
          element: secure('/liste_tracking', <ListeTrackingGlobal/>)
        },
        {
          path: '/controle',
          element: secure('/controle', <ControleDeBase datas={dataPermission}/>)
        },
        {
          path: '/format',
          element: secure('/format', <Format/>)
        },
        {
          path: '/frequence',
          element: secure('/frequence', <Frequence/>) 
        },
        {
          path: '/permission',
          element: secure('/permission', <Permission/>)
        },
        {
          path: '/Projet',
          element: secure('/Projet',<Projet/>)
        },
        {
          path: '/offre',
          element: secure('/offre',<Offres/>)
        },
        {
          path: '/budget',
          element: secure('/budget',<Budget/>)
        },
        {
          path: '/besoins',
          element: <Besoins/>
        },
        {
          path: '/fournisseur',
          element: secure('/fournisseur', <Fournisseur/>)
        },
        {
          path: '/batiment',
          element: secure('/batiment',<Batiment datas={dataPermission}/>)
        },
        {
          path: '/liste_bins',
          element: secure('/liste_bins',<ListBinGlobal/>)
        },
        {
          path: '/adresse',
          element: secure('/adresse', <Adresse/>)
        },
        {
          path: '/liste_equipement',
          element: secure('/liste_equipement', <ListeEquipementGlobal/>)
        },
        {
          path: '/liste_entrepot',
          element: secure('/liste_entrepot', <EntrepotListeGlobale/>)
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
          element: secure('/corpsMetier', <CorpsMetier/>)
        },
        {
          path: '/niveau',
          element: secure('/niveau', <Niveau/>)
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
          element: secure('/liste_inspection', <Instructions/>)
        },
        {
          path: '/liste_template',
          element: secure('/liste_template', <Template datas={dataPermission} />)
        },
        {
          path: '/template_form',
          element: secure('/template_form', <TemplateForm/>)
        },
        {
          path: '/liste_declaration',
          element: secure('/liste_declaration', <Declaration/>)
        },
        {
          path: '/declaration_form',
          element: secure('/declaration_form', <DeclarationForm/>)
        },
        {
          path: '/declaration',
          element: secure('/declaration', <Declaration/>)
        },
        {
          path: '/liste_cat_inspection',
          element: secure('/liste_cat_inspection', <CatInspection/>)
        },
        {
          path: '/utilisateur',
          element: secure('/utilisateur', <Users/>)
        },
        {
          path: '/profile',
          element: secure('/profile', <Profile/>)
        },
        {
          path: '/contrat',
          element: secure('/contrat', <Contrat/>)
        },
        {
          path: '/rapport_declaration',
          element: secure('/rapport_declaration', <RapportDeclaration/>)
        },
        {
          path: '/corbeille',
          element: secure('/corbeille', <Corbeille/>)
        },
        {
          path: '/rapport_special',
          element: secure('/rapport_special',<RapportSpecial/>)
        },
        {
          path: '/liste_vehicule',
          element: secure('/liste_vehicule', <Charroi/>)
        },
        {
          path: '/liste_chauffeur',
          element: secure('/liste_chauffeur', <Chauffeur/>)
        },
        {
          path: '/liste_affectation',
          element: secure('/liste_affectation', <Affectations/>)
        },
        {
          path: '/liste_site',
          element: secure('/liste_site',<Sites/>)
        },
        {
          path: '/controle_technique',
          element: secure('/controle_technique', <ControleTechnique/>)
        },
/*         {
          path: '/liste_reparation',
          element: <ControleTechnique/>
        }, */
        {
          path: '/marque',
          element: secure('/marque', <Marque/>)
        },
        {
          path: '/type_reparation',
          element: secure('/type_reparation', <TypeReparation/>)
        },
        {
          path: '/piece',
          element: secure('/piece', <Piece/>)
        },
        {
          path: '/localisation',
          element: secure('/localisation', <Localisation/>)
        },
        {
          path: '/demande_vehicule',
          element: secure('/demande_vehicule', <DemandeVehicule/>)
        },
        {
          path: '/liste_pays',
          element: secure('/demande_vehicule', <Pays/>)
        },
        {
          path: '/liste_demandeur',
          element: secure('/liste_demandeur', <DemandeurVehicule/>)
        },
        {
          path: '/generale',
          element: secure('/generale', <Generale/>)
        },
        {
          path: '/monitoring',
          element: secure('/monitoring', <Monitoring/>)
        },
        {
          path: '/geofences',
          element: secure('/geofences', <Geofences/>)
        },
        {
          path: '/carburant',
          element: secure('/carburant', <Carburant/>)
        }
      ]
    },
    {
      path: '/securite/dashboard', element: <Securite/>
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/password_forgot', element: <PasswordForgot /> },
    { path: '/reset-password/:id', element: <PasswordReset /> },
    {
      path: '/*',
      element:<SecureRoute><Page404 /></SecureRoute>
    },
    { path: '/tv-dashboard', element: <ModeTv /> },
  ]);

  return (
    <>
    {isLoading ? (
      <div className="spinnerContainer">
        <PacmanLoader color="rgb(131, 159, 241)" loading={isLoading} height={15} radius={2} margin={2} />
      </div>
    ) : (
      <div className="app">
        <RouterProvider router={router} />
      </div>
    )}
    </>
  );
}

export default App;
