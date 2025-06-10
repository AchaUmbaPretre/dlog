import { Navigate, useLocation } from 'react-router-dom';
import { useMenu } from '../context/MenuProvider';
import { useSelector } from 'react-redux';

const SecureRoute = ({ children }) => {
  const location = useLocation();
  const { dataPermission } = useMenu();
  const role = useSelector((state) => state.user?.currentUser?.role);

  const isAdmin = role === 'Admin'; 

  const hasAccess = (path) => {
    if (isAdmin) return true; // admin a accès à tout

    for (const menu of dataPermission) {
      if (menu.menu_url === path && menu.can_read) return true;
      for (const sub of menu.subMenus || []) {
        if (sub.submenu_url === path && sub.can_read) return true;
      }
    }
    return false;
  };

  if (!hasAccess(location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default SecureRoute;
