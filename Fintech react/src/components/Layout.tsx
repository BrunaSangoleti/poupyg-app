import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

/**
 * App Shell Pattern:
 * - Sidebar fixa à esquerda (w-64)
 * - Main Area ocupa o restante (pl-64)
 */
const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;