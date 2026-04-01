// src/queries/complaint.queries.ts
import { useQuery } from '@tanstack/react-query';
import { getComplaints } from '@/api/complaint.api';

export const useComplaints = (params?: {
  page?: number;
  page_size?: number;
  status?: string;
  priority?: string;
  search?: string;
  customer_id?: number;
}) =>
  useQuery({
    queryKey: ['complaints', params],
    queryFn: () => getComplaints(params),
  });
