import React from 'react';
import loadImage from '../Assets/Load.png';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <img src={loadImage} alt="Loading" className="animate-spin h-40 w-40 rounded-full" />
      <div className="text-2xl text-white mt-4">{message}</div>
    </div>
  );
};

export default Loading;
