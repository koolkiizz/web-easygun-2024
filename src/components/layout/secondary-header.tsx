import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import AddCoin from '../../assets/add-coin.png';
import Fanpage from '../../assets/fanpage.png';
import Logo1 from '../../assets/logo-1.png';
// import Logo from '../../assets/logo.png';
import ViewMore from '../../assets/view-more.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const VIEW_MORE_MENU = [
  {
    label: 'Tin tức',
    key: 'new',
    onClick: undefined,
  },
  {
    label: 'Sự kiện',
    key: 'event',
    onClick: undefined,
  },
  {
    label: 'Cẩm nang',
    key: 'tips',
    onClick: undefined,
  },
  {
    label: 'Comming soon',
    key: 'later',
    onClick: undefined,
  },
];

const SecondaryHeader: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-between items-center h-full bg-[#964B00] p-[12px]">
      <Link to={'/'}>
        <img src={Logo1} alt="Logo" className="h-full transform translate-y-[-16px]" />
      </Link>
      <nav>
        <ul className="flex items-center gap-[44px] py-[12px]">
          <li className="flex items-center" key={'fanpage'}>
            <Button variant={'ghost'} onClick={() => scrollToSection('hero')} className="p-0 m-0 h-auto">
              <Link to={''} target="_blank">
                <img src={Fanpage} alt="fanpage" />
              </Link>
            </Button>
          </li>
          <li className="flex items-center" key={'add'}>
            <Button variant={'ghost'} onClick={() => scrollToSection('about')} className="p-0 m-0 h-auto">
              <Link to={''} target="_blank">
                <img src={AddCoin} alt="add-coin" />
              </Link>
            </Button>
          </li>
          <li className="flex items-center" key={'more'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} onClick={() => scrollToSection('services')} className="p-0 m-0 h-auto">
                  <img src={ViewMore} alt="view-more" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 z-15 bg-white rounded-[8px]">
                <DropdownMenuGroup>
                  {VIEW_MORE_MENU.map(item => (
                    <div className="cursor-pointer hover:bg-slate-200" key={item.key}>
                      <DropdownMenuItem key={item.key} onClick={item.onClick}>
                        <span className="cursor-pointer">{item.label}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SecondaryHeader;
