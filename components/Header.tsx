
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800">
          AI Website Specification Generator
        </h1>
        <p className="text-gray-600 mt-1">
          For B2B Client Websites
        </p>
      </div>
    </header>
  );
};

export default Header;
