import React from 'react';
import comingsoon from '@/assets/images/ARENA_Coming_Soon.png';

const MainPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#050c26] overflow-auto">
      <img src={comingsoon} alt="ARENA Coming Soon" className="w-full h-full object-cover" />
    </div>
  );
};

export default MainPage;
