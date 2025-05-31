'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-ctx';
import { Logo } from './logo';
import { Button } from '../ui/button';

export const Header = () => {
  const { data, authStatus, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem('token');
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-screen-2xl w-11/12 mx-auto flex items-center justify-between h-20">
        <div className="flex items-center space-x-8">
          <Logo />
        </div>
        {authStatus === 'authenticated' && (
          <>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/home"
                className={`flex items-center space-x-2 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-500'}`}
              >
                <span className="text-sm">Lista Formulario</span>
              </Link>
              <Link
                href="/form"
                className={`flex items-center space-x-2 ${pathname === '/form' ? 'text-blue-600' : 'text-gray-500'}`}
              >
                <span className="text-sm">Crear Formulario</span>
              </Link>
            </nav>
          </>
        )}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {authStatus === 'authenticated' && data && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden md:flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">{data?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium">¡Bienvenido!</span>
                  <span className="text-xs text-gray-500">
                    {data?.name} - {data?.role}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSignOut()}>
                <span className="text-sm">Cerrar sesión</span>
                <LogOut width={16} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isMenuOpen && authStatus === 'authenticated' && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="w-11/12 mx-auto py-4 space-y-4">
            <Link
              href="/home"
              className={`flex items-center space-x-2 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <span className="text-sm">Lista Formulario</span>
            </Link>
            <Link
              href="/form"
              className={`flex items-center space-x-2 ${pathname === '/form' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <span className="text-sm">Crear Formulario</span>
            </Link>

            <div className="flex items-center space-x-3 w-full justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-gray-900 text-xs">{data?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium"> {data?.name}</p>
                  <span className="text-xs text-gray-500">{data?.role}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                className="cursor-pointer flex items-center space-x-2"
                onClick={() => handleSignOut()}
              >
                <span className="text-sm">Cerrar sesión</span>
                <LogOut width={16} />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
