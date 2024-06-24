import React from 'react';

import AboutSection from '@/pages/Landingpage/AboutSection';
import ContactSection from '@/pages/Landingpage/ContactSection';
import HeroSection from '@/pages/Landingpage/HeroSection';
import ServicesSection from '@/pages/Landingpage/ServicesSection';

const Landingpage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </>
  );
};

export default Landingpage;
