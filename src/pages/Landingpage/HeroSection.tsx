import React from 'react';

import SubTitle from '@/assets/sub-title.png';
import { Button } from '@/components/ui/button';
import AppleIcon from '../../assets/apple-icon.png';
import Banner from '../../assets/banner-2.png';
import DownloadChicken from '../../assets/download-chicken.png';
import DownloadLocal from '../../assets/download-local.png';
import PlayStoreIcon from '../../assets/play-store-icon.png';
import Title from '../../assets/title.png';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="bg-gray-100 h-full relative h-[calc(100vh-90px)]">
      <img src={Banner} alt="banner" className="h-full w-full object-cover absolute" />
      <Button
        className="absolute p-0 m-0 top-[25%] transform translate-y-[-50%] left-0 h-auto w-auto "
        variant={'ghost'}
      >
        <img src={DownloadChicken} alt="download" className=" object-fill h-full w-full" />
      </Button>
      <img src={Title} alt="giao dien huyen thoai" className="h-full w-full absolute" />
      <img src={SubTitle} alt="giao dien huyen thoai" className="h-full w-full absolute" />

      <Button
        className="p-0 m-0 bottom-[10%] left-[50%] absolute h-auto w-auto transform translate-x-[-50%]"
        variant={'ghost'}
      >
        <img src={DownloadLocal} alt="download-macos-window" className=" object-fill h-full w-full" />
      </Button>
      <div className="absolute flex flex-col w-[344px] gap-[16px] bottom-[7%] left-[3%]">
        <Button className="p-0 m-0 flex items-center gap-[12px] py-[12px] bg-white h-auto rounded-[20px] text-lg hover:bg-white hover:opacity-85">
          <img src={PlayStoreIcon} alt="play-store-download" className="h-[48px] w-[48px]" />
          <span>GET IT ON AFK</span>
        </Button>
        <Button className="p-0 m-0 flex items-center gap-[12px] py-[12px] bg-[#646464] h-auto rounded-[20px] text-white text-lg hover:bg-[#646464] hover:opacity-85">
          <img src={AppleIcon} alt="app-store-download" className="h-[48px] w-[48px]" />
          <span>DOWNLOAD ON THE IOS</span>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
