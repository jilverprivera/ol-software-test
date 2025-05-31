'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { z } from 'zod';
import { IMerchant } from '@/interface/merchant-interface';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-ctx';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const merchantFormSchema = z.object({
  name: z.string().min(3, 'Nombre o razón social debe tener al menos 3 caracteres.'),
  city: z.string().min(1, 'Seleccione una ciudad.'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos.'),
  email: z.string().min(1, 'El correo electrónico es requerido.').email('Ingrese un correo electrónico válido.'),
  registrationDate: z.date({
    required_error: 'La fecha de registro es requerida',
  }),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    required_error: 'Seleccione un estado.',
  }),
  hasEstablishments: z.boolean(),
  employeeCount: z.string().optional(),
  revenue: z.string().optional(),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;

type MerchantFormProps = {
  initialData?: IMerchant;
};

export const MerchantForm = ({ initialData }: MerchantFormProps) => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      city: initialData?.municipality || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      registrationDate: initialData?.registrationDate ? new Date(initialData.registrationDate) : new Date(),
      status: (initialData?.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
      hasEstablishments:
        initialData?.establishments?.some(
          (establishment) => Number(establishment.employeeCount) > 0 || Number(establishment.revenue) > 0,
        ) || false,
      employeeCount: initialData?.establishments?.some(
        (establishment) => Number(establishment.employeeCount) > 0 || Number(establishment.revenue) > 0,
      )
        ? initialData?.establishments?.reduce((acc, curr) => acc + (Number(curr.employeeCount) || 0), 0).toString()
        : Number(Math.floor(Math.random() * (30 - 10 + 1)) + 10).toString(),
      revenue: initialData?.establishments?.some(
        (establishment) => Number(establishment.employeeCount) > 0 || Number(establishment.revenue) > 0,
      )
        ? initialData?.establishments?.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0).toString()
        : Number(Math.floor(Math.random() * (10000000 - 500000 + 1)) + 500000).toString(),
    },
  });

  useEffect(() => {
    if (initialData) {
      const hasEstablishmentsValue =
        initialData.establishments?.some(
          (establishment) => Number(establishment.employeeCount) > 0 || Number(establishment.revenue) > 0,
        ) || false;

      form.reset({
        name: initialData.name || '',
        city: initialData.municipality || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        registrationDate: initialData.registrationDate ? new Date(initialData.registrationDate) : new Date(),
        status: (initialData.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
        hasEstablishments: hasEstablishmentsValue,
        employeeCount: hasEstablishmentsValue
          ? initialData.establishments?.reduce((acc, curr) => acc + (Number(curr.employeeCount) || 0), 0).toString()
          : Number(Math.floor(Math.random() * (30 - 10 + 1)) + 10).toString(),
        revenue: hasEstablishmentsValue
          ? initialData.establishments?.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0).toString()
          : Number(Math.floor(Math.random() * (10000000 - 500000 + 1)) + 500000).toString(),
      });
    }
  }, [initialData, form]);

  const fetchCities = async () => {
    if (!accessToken) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/cities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
    enabled: !!accessToken,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalIncome =
    initialData?.establishments?.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0) ||
    Math.floor(Math.random() * (10000000 - 500000 + 1)) + 500000;
  const totalEmployees =
    initialData?.establishments?.reduce((acc, curr) => acc + (Number(curr.employeeCount) || 0), 0) ||
    Math.floor(Math.random() * (30 - 10 + 1)) + 10;

  const handleSubmit = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const isValid = form.formState.isValid;
    if (!isValid) {
      toast.error('Formulario no válido', { duration: 2000 });
      return;
    }
    const obj = {
      name: form.getValues().name,
      municipality: form.getValues().city,
      phone: form.getValues().phone,
      email: form.getValues().email,
      registrationDate: form.getValues().registrationDate.toISOString(),
      status: form.getValues().status,
      employeeCount: form.getValues().hasEstablishments ? form.getValues().employeeCount : null,
      revenue: form.getValues().hasEstablishments ? form.getValues().revenue : null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants${initialData ? `/${initialData.id}` : ''}`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(obj),
        },
      );

      if (!response.ok) {
        throw new Error('Error al enviar los datos del formulario');
      } else {
        await response.json();
        toast.success(initialData ? 'Comerciante actualizado con éxito' : 'Comerciante creado con éxito', {
          duration: 2000,
        });
        if (initialData) {
          setTimeout(() => {
            router.push('/home');
          }, 2000);
        } else {
          form.reset();
          setTimeout(() => {
            router.push('/home');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error al enviar los datos del formulario:', error);
      toast.error(initialData ? 'Error al actualizar comerciante' : 'Error al crear comerciante', {
        duration: 2000,
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Datos Generales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre o razón social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Ciudad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione ciudad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.data?.map((city: string, idx: number) => (
                        <SelectItem key={idx} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de registro</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Seleccione fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Activo</SelectItem>
                      <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasEstablishments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>¿Posee establecimientos?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-screen-2xl mx-auto px-8 py-4 rounded-t-3xl flex items-center justify-between bg-slate-900 text-white">
            {form.watch('hasEstablishments') ? (
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-slate-300">Total Ingresos Formulario:</p>
                  <p className="text-xl font-semibold">${totalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Cantidad de empleados:</p>
                  <p className="text-xl font-semibold">{totalEmployees}</p>
                </div>
              </div>
            ) : (
              <div />
            )}
            <div className="flex flex-row items-center justify-center gap-2 border border-slate-800 rounded-lg p-2 space-x-4 text-white">
              <p className="text-sm text-slate-300">
                Si ya registraste todos los datos, {initialData ? 'actualiza' : 'crea'} tu formulario aquí.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={!form.formState.isValid}
                onClick={(e) => handleSubmit(e)}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-white"
              >
                {initialData ? 'Actualizar' : 'Enviar'} Formulario
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
