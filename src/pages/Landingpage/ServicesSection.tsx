import React from 'react';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Service 1</h3>
            <p>Detail about service 1.</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Service 2</h3>
            <p>Detail about service 2.</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Service 3</h3>
            <p>Detail about service 3.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
