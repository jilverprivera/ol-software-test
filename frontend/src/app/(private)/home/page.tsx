'use client';

import { CircleCheck, CircleX, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Container } from '@/components/layout/container';
import { useAuth } from '@/context/auth-ctx';
import { IMerchant } from '@/interface/merchant-interface';

export default function HomePage() {
  const { accessToken, data } = useAuth();

  const fetchData = async () => {
    if (!accessToken) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: merchants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['merchants'],
    queryFn: fetchData,
    enabled: !!accessToken,
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ProtectedRoute>
      <Header />
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Lista Formularios Creados</h1>
          <div className="flex justify-end space-x-4">
            <Button>Crear Formulario Nuevo</Button>
            <Button variant="outline">Descargar Reporte en CSV</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table className="border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <TableHeader className="bg-sky-600">
              <TableRow>
                <TableHead className="text-white text-center">Razón Social</TableHead>
                <TableHead className="text-white text-center">Teléfono</TableHead>
                <TableHead className="text-white text-center">Correo Electrónico</TableHead>
                <TableHead className="text-white text-center">Fecha Registro</TableHead>
                <TableHead className="text-white text-center">No. Establecimientos</TableHead>
                <TableHead className="text-white text-center">Estado</TableHead>
                <TableHead className="text-white text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants?.data?.map((row: IMerchant) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-center">{row.name}</TableCell>
                  <TableCell className="text-center">{row.phone}</TableCell>
                  <TableCell className="text-center">{row.email}</TableCell>
                  <TableCell className="text-center">{new Date(row.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    {row.establishments.length > 1
                      ? `${row.establishments.length} Establecimientos`
                      : `${row.establishments.length} Establecimiento`}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {row.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon">
                        {row.status === 'ACTIVE' ? (
                          <CircleX width={16} className=" text-red-500" />
                        ) : (
                          <CircleCheck width={16} className=" text-green-500" />
                        )}
                      </Button>

                      {data?.role === 'Administrador' && (
                        <Button variant="ghost" size="icon">
                          <Trash2 width={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Items:</span>
              <select className="border rounded px-2 py-1 text-sm">
                <option>5</option>
                <option>10</option>
                <option>15</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                &lt;
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-500 text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span>...</span>
              <Button variant="outline" size="sm">
                50
              </Button>
              <Button variant="outline" size="sm">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
