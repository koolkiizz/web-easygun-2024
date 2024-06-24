import React from 'react';

import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MyLandingPage</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button onClick={() => scrollToSection('hero')} className="hover:text-gray-300">
                Home
              </Button>
            </li>
            <li>
              <Button onClick={() => scrollToSection('about')} className="hover:text-gray-300">
                About
              </Button>
            </li>
            <li>
              <Button onClick={() => scrollToSection('services')} className="hover:text-gray-300">
                Services
              </Button>
            </li>
            <li>
              <Button onClick={() => scrollToSection('contact')} className="hover:text-gray-300">
                Contact
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
