import React from 'react';
import BannerSVG from '@/assets/images/banner.svg';

export default function Banner() {
  return (
    <div>
      <img src={BannerSVG} alt="Banner" className="w-full h-full " />
    </div>
  );
}
