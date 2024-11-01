import React from 'react';
import { Link } from 'react-router-dom';

import Account from '@/assets/account.png';
import AddCoin from '@/assets/add-coin.png';
import ChangeCoin from '@/assets/change-coin.png';
import Character from '@/assets/character.png';
import ForgotPasswordIcon from '@/assets/forgot-password.png';
import LoginIcon from '@/assets/login.png';
import RegisterIcon from '@/assets/register.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/router/constants';
import Logo1 from '../../assets/logo-1.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const ACCOUNT_MENU = [
  {
    label: 'Đổi mật khẩu',
    key: 'change-password',
    href: ROUTES.CHANGE_PASSWORD,
  },
  {
    label: 'Đổi email',
    key: 'change-email',
    href: ROUTES.CHANGE_EMAIL,
  },
  {
    label: 'Xác thực email',
    key: 'email-verify',
    href: ROUTES.VERIFy_EMAIL,
  },
  {
    label: 'Xác thực 2 lớp',
    key: 'duplicate-verify',
    href: ROUTES.DUPLICATE_VERIFY,
  },
  {
    label: 'Đăng xuất',
    key: 'log-out',
    href: ROUTES.LOGOUT,
  },
];

const CHARACTER_MENU = [
  {
    label: 'Xóa mật khẩu rương',
    key: 'remove',
    href: ROUTES.CLEAR_BAG,
  },
  {
    label: 'Lịch sử chuyển xu',
    key: 'history',
    href: ROUTES.HISTORY,
  },
];

const NAV_NORMAL = [
  {
    key: 'login',
    label: <img className="h-full" src={LoginIcon} alt="login" />,
    href: ROUTES.LOGIN,
  },

  {
    key: 'signup',
    label: <img className="h-full" src={RegisterIcon} alt="signup" />,
    href: ROUTES.SIGNUP,
  },
  {
    key: 'forgot-password',
    label: <img className="h-full" src={ForgotPasswordIcon} alt="forgot-password" />,
    href: ROUTES.FORGOT_PASSWORD,
  },
];

const NAV_LOGINED = [
  {
    key: 'add-coin',
    label: <img className="h-full" src={AddCoin} alt="add-coin" />,
    href: ROUTES.ADD_COIN,
  },
  {
    key: 'transfer',
    label: <img className="h-full" src={ChangeCoin} alt="transfer-coin" />,
    href: ROUTES.TRANSFER_COIN,
  },
  {
    key: 'character',
    label: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="p-0 m-0 h-auto hover:bg-transparent  h-[48px]">
            <img className="h-full" src={Character} alt="character" />,
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 z-15 bg-white rounded-[8px]">
          <DropdownMenuGroup>
            {CHARACTER_MENU.map(item => (
              <div className="cursor-pointer hover:bg-slate-200" key={item.key}>
                <Link to={item.href} className="cursor-pointer" key={item.key}>
                  <DropdownMenuItem>{item.label}</DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    href: ROUTES.HOMEPAGE,
  },
  {
    key: 'account',
    label: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="p-0 m-0 h-auto hover:bg-transparent h-[48px]">
            <img className="h-full" src={Account} alt="account" />,
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 z-15 bg-white rounded-[8px]">
          <DropdownMenuGroup>
            {ACCOUNT_MENU.map(item => (
              <div className="cursor-pointer hover:bg-slate-200" key={item.key}>
                <Link to={item.href} className="cursor-pointer" key={item.key}>
                  <DropdownMenuItem>{item.label}</DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    href: ROUTES.HOMEPAGE,
  },
];

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex justify-between items-center h-full bg-[#964B00] p-[12px]">
      <Link to={'/'}>
        <img className="h-full ransform translate-y-[-16px]" src={Logo1} alt="Logo" />
      </Link>
      <nav>
        <ul className="flex items-center gap-[44px] py-[12px]">
          {(isAuthenticated ? NAV_LOGINED : NAV_NORMAL).map(item => (
            <li className="flex items-center" key={item.key}>
              <Button variant={'ghost'} className="p-0 m-0 h-auto hover:bg-transparent h-[48px]">
                <Link to={item.href} className="h-full">
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
