import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
