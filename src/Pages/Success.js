import React from 'react';
import { Link } from 'react-router-dom';

function Success() {
  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-5">Success!</h1>
      <p className="mb-5">Your event has been successfully updated.</p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
        Return to Home
      </Link>
    </div>
  );
}

export default Success;