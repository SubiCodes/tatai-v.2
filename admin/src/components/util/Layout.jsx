import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar.jsx';

import { useState } from 'react';

const Layout = () => {
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen flex-row relative">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex flex-col h-screen w-screen bg-[#F5F7FA]">
          <Outlet />
        </div>
    </div>
  );
};

export default Layout;