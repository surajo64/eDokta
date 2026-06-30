import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="relative h-16 w-16">
        {/* Simple spinning border */}
        <div className="animate-spin rounded-full h-full w-full border-t-4 border-blue-500 border-solid"></div>
      </div>
    </div>
  );
};

export default Loading; 
