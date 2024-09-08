import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header';

const PrimaryLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full h-[90px] z-0">
        <Header />
      </header>
      <main className="mt-[90px] h-[calc(100vh-90px)] overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PrimaryLayout;
