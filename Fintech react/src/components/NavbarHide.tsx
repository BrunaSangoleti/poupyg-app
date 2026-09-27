import { useLocation } from 'react-router-dom';

const NavbarHide = () => {
    const location = useLocation();

    const hideNavbarRoutes = ['/login', '/404'];

    if (hideNavbarRoutes.includes(location.pathname) || location.pathname === '/login') {
        return null;
    }

    return null;
};

export default NavbarHide;