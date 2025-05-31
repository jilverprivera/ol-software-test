import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export const useMerchant = (accessToken: string | null) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const fetchMainData = async () => {
    if (!accessToken) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants?page=${currentPage}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: response,
    isLoading: loadingMerchants,
    error: errorMerchants,
    refetch,
  } = useQuery({
    queryKey: ['merchants', currentPage, limit],
    queryFn: fetchMainData,
    enabled: !!accessToken,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= response?.meta?.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUpdateMerchantStatus = async (id: number, status: string) => {
    if (!accessToken) return null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error('Failed to update merchant status');
      }
      if (res.ok) {
        const data = await res.json();
        await refetch();
        toast.success('Éxito', {
          description: 'El estado del comerciante ha sido actualizado correctamente',
          duration: 2000,
        });
        return data;
      }
    } catch (error) {
      console.error('Error updating merchant status:', error);
      toast.error('Error', {
        description: 'Error al actualizar el estado del comerciante',
        duration: 2000,
      });
      return null;
    }
  };

  const handleDeleteMerchant = async (id: number) => {
    if (!accessToken) return null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete merchant');
      }
      if (res.ok) {
        toast.success('Éxito', {
          description: 'El comerciante ha sido eliminado correctamente',
          duration: 2000,
        });
        await refetch();
        return res.json();
      }
    } catch (error) {
      console.error('Error deleting merchant:', error);
      toast.error('Error', {
        description: 'Error al eliminar el comerciante',
        duration: 2000,
      });
      return null;
    }
  };

  const handleExportCsv = async () => {
    if (!accessToken) return null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/export/csv`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 403) {
        throw new Error('No tienes permisos para exportar el CSV. Se requiere rol de administrador.');
      }

      if (!res.ok) {
        throw new Error('Error al exportar el CSV');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merchants.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (error) {
      console.error('Error exportando CSV:', error);
      throw error;
    }
  };

  return {
    merchants: response?.data || [],
    meta: response?.meta || null,
    loadingMerchants,
    errorMerchants,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    handlePageChange,
    handleUpdateMerchantStatus,
    handleDeleteMerchant,
    handleExportCsv,
  };
};
