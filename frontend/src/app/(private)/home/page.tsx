'use client';

import { CircleCheck, CircleX, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Container } from '@/components/layout/container';
import { useAuth } from '@/context/auth-ctx';
import { IMerchant } from '@/interface/merchant-interface';
import { useMerchant } from '@/hooks/use-merchant';

export default function HomePage() {
  const { accessToken, data } = useAuth();

  const {
    merchants,
    meta,
    loadingMerchants,
    errorMerchants,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    handlePageChange,
    handleUpdateMerchantStatus,
    handleExportCsv,
    handleDeleteMerchant,
  } = useMerchant(accessToken);

  if (loadingMerchants) return <div>Loading...</div>;
  if (errorMerchants) return <div>Error: {errorMerchants.message}</div>;

  return (
    <ProtectedRoute>
      <Header />
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Lista Formularios Creados</h1>
          <div className="flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-4">
            <Button asChild>
              <Link href="/form">Crear Formulario Nuevo</Link>
            </Button>
            <Button variant="outline" onClick={handleExportCsv}>
              Descargar Reporte en CSV
            </Button>
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
              {merchants?.map((row: IMerchant) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-center">{row.name}</TableCell>
                  <TableCell className="text-center">{row.phone}</TableCell>
                  <TableCell className="text-center">{row.email}</TableCell>
                  <TableCell className="text-center">{new Date(row.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    {row.establishments.every(est => est.employeeCount === 0 && Number(est.revenue) === 0)
                      ? '0 Establecimientos'
                      : row.establishments.length !== 1
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/update-form/${row.id}`} aria-label="Editar">
                              <Edit width={16} />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateMerchantStatus(row.id, row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                            aria-label={row.status === 'ACTIVE' ? 'Inactivar' : 'Activar'}
                          >
                            {row.status === 'ACTIVE' ? (
                              <CircleX width={16} className=" text-red-500" />
                            ) : (
                              <CircleCheck width={16} className=" text-green-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{row.status === 'ACTIVE' ? 'Inactivar' : 'Activar'}</p>
                        </TooltipContent>
                      </Tooltip>

                      {data?.role === 'Administrador' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteMerchant(row.id)} aria-label="Eliminar">
                              <Trash2 width={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar:</span>
              <Select
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setCurrentPage(1);
                }}
                value={limit.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione cantidad" />
                </SelectTrigger>

                <SelectContent>
                  {[5, 10, 15].map((item: number, idx: number) => (
                    <SelectItem key={idx} value={item.toString()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>

              {Array.from({ length: meta?.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  className={currentPage === page ? 'bg-blue-500 text-white' : ''}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta?.totalPages}
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
