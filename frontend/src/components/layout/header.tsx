'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from './logo';
import { useAuth } from '@/context/auth-ctx';

export const Header = () => {
  const { data, authStatus } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-8">
          <Logo />

          {authStatus === 'authenticated' && (
            <nav className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <span className="text-lg">1</span>
                <span className="text-sm">Lista Formulario</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-lg">2</span>
                <span className="text-sm">Crear Formulario</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-lg">3</span>
                <span className="text-sm">Beneficios por renovar</span>
              </div>
            </nav>
          )}
        </div>

        {authStatus === 'authenticated' && data && (
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs">{data?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">¡Bienvenido!</span>
              <span className="text-xs text-gray-500">
                {data?.name} - {data?.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
