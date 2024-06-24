import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-8">Reach out to us for more information.</p>
        <form className="max-w-lg mx-auto">
          <input type="text" placeholder="Name" className="w-full mb-4 p-2 border border-gray-300 rounded" />
          <input type="email" placeholder="Email" className="w-full mb-4 p-2 border border-gray-300 rounded" />
          <textarea
            placeholder="Message"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            rows={4}
          ></textarea>
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
