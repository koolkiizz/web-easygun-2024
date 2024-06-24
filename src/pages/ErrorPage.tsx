import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage = 'An unexpected error has occurred.' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Error</h1>
      <p className="text-lg text-gray-700 mt-4">{errorMessage}</p>
      <div className="mt-6">
        <button className="px-4 py-2 mr-4 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={handleGoBack}>
          Go Back
        </button>
        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600" onClick={handleGoHome}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
