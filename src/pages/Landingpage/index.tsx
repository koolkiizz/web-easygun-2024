import React from 'react';

import SubTitle from '@/assets/sub-title.png';
import { Button } from '@/components/ui/button';
import AppleIcon from '../../assets/apple-icon.png';
import Banner from '../../assets/banner.png';
import DownloadChicken from '../../assets/download-chicken.png';
import DownloadLocal from '../../assets/download-local.png';
import PlayStoreIcon from '../../assets/play-store-icon.png';
import Title from '../../assets/title.png';

const Landingpage: React.FC = () => {
  return (
    <>
      <section id="hero" className="bg-gray-100 h-full relative h-[calc(100vh-90px)]">
        <img src={Banner} alt="banner" className="h-full w-full object-cover absolute" />
        <Button
          className="absolute p-0 m-0 top-[25%] transform translate-y-[-50%] right-0 h-auto w-auto hover:bg-transparent"
          variant={'ghost'}
        >
          <img src={DownloadChicken} alt="download" className=" object-fill h-full w-full" />
        </Button>
        <img
          src={Title}
          alt="giao dien huyen thoai"
          className="h-[100px] w-full absolute object-contain flex items-center"
        />
        <img
          src={SubTitle}
          alt="game la de"
          className="h-[100px] w-[80%] right-0 absolute object-contain flex items-center bottom-0"
        />

        <Button
          className="p-0 m-0 bottom-[10%] left-[50%] absolute h-auto w-auto transform translate-x-[-50%] hover:bg-transparent"
          variant={'ghost'}
        >
          <img src={DownloadLocal} alt="download-macos-window" className=" object-fill h-full w-full" />
        </Button>
        <div className="absolute flex flex-col gap-[16px] bottom-[7%] left-[3%] w-[180px] md:w-[224px]">
          <Button className=" text-black hover:bg-transparent m-0 flex items-center gap-[12px] py-[12px] px-[16px] bg-white h-auto rounded-[20px] text-lg hover:bg-white hover:opacity-85">
            <img src={PlayStoreIcon} alt="play-store-download" className="h-[48px] w-[48px]" />
            <div className="flex flex-col items-start">
              <span>TẢI GAME TỪ</span>
              <span className="font-bold">APK</span>
            </div>
          </Button>
          <Button className=" hover:bg-transparent m-0 flex items-center gap-[12px] px-[16px] py-[12px] bg-[#646464] h-auto rounded-[20px] text-white text-lg hover:bg-[#646464] hover:opacity-85">
            <img src={AppleIcon} alt="app-store-download" className="h-[48px] w-[48px]" />
            <div className="flex flex-col items-start">
              <span>TẢI GAME TRÊN</span>
              <span className="font-bold">IOS</span>
            </div>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Landingpage;
