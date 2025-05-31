'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-ctx';

const loginSchema = z.object({
  email: z.string().min(1, 'Correo electrónico es requerido.').email('Correo electrónico no es válido.'),
  password: z
    .string()
    .min(6, 'Contraseña debe tener al menos 6 caracteres.')
    .max(100, 'Contraseña no puede tener más de 100 caracteres.'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones.',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { setAuthStatus, setAccessToken, setData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (resp.ok) {
        const data = await resp.json();
        setAuthStatus('authenticated');
        setAccessToken(data.access_token);
        const decodedToken = jwtDecode<{ name: string; email: string; role: string }>(data.access_token);
        setData({ name: decodedToken.name, email: decodedToken.email, role: decodedToken.role });
        localStorage.setItem('token', data.access_token);
        router.push('/home');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setAuthStatus('unauthenticated');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-gray-600 text-xl font-medium text-center mb-4">
          Debes iniciar sesión para acceder a la plataforma
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Digita tu correo electrónico y la contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="jilverrivera@gmail.com" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox disabled={isLoading} checked={field.value} onCheckedChange={field.onChange} />
                          <div className="space-y-1 leading-none">
                            <FormLabel>Acepto términos y condiciones</FormLabel>
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
