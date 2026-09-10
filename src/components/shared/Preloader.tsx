import React, { memo } from "react";

const Preloader: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 bg-primary/20 rounded-full animate-ping"></div>
        <img 
          src="/mtmkay_logo.png" 
          width="68" 
          height="68" 
          alt="MTMKay Logo"
          className="relative z-10"
        />
      </div>
      <p className="mt-6 text-xl font-semibold text-gray-700 tracking-widest animate-pulse">
        MTMKAY
      </p>
    </div>
  );
});

Preloader.displayName = 'Preloader';

export default Preloader;
