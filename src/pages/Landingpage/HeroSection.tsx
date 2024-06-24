import React from 'react';

import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to MyLandingPage</h2>
        <p className="text-lg mb-8">We offer amazing services to boost your business.</p>
        <Button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Get Started</Button>
      </div>
    </section>
  );
};

export default HeroSection;
