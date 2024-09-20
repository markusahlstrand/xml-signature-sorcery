import React from 'react';
import XmlSigner from '../components/XmlSigner';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">XML Digital Signature Demo</h1>
        <XmlSigner />
      </div>
    </div>
  );
};

export default Index;
