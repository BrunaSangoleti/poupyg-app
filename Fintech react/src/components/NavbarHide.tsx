import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

const NavbarHide = () => {
    const location = useLocation();

    
    const hideNavbarRoutes = ['/login', '/404'];

    
    if (hideNavbarRoutes.includes(location.pathname) || location.pathname === '/login') {
        return null;
    }

    return <Navbar />;
};

export default NavbarHide