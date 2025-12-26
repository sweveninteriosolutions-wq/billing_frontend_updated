'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TablePagination } from '@/components/TablePagination';

import UserActivityTable from '../tables/UserActivityTable';

import { useUserActivities } from '@/queries/activity.queries';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';

const DEFAULT_PAGE_SIZE = 20;

export default function UserActivityPage() {
  /* =========================
     FILTERS
  ========================= */
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  const debouncedUsername = useDebounce(username, 400);
  const debouncedUserId = useDebounce(userId, 400);

  /* =========================
     PAGINATION
  ========================= */
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    reset,
  } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading, isFetching } = useUserActivities({
    username: debouncedUsername || undefined,
    user_id: debouncedUserId
      ? Number(debouncedUserId)
      : undefined,
    page,
    page_size: pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const activities = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER + FILTERS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            User Activity Logs
          </h1>
          <p className="text-muted-foreground">
            Audit trail of system actions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              reset();
            }}
            className="w-40"
          />

          <Input
            placeholder="User ID"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              reset();
            }}
            className="w-32"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5" />
              Activity Logs
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <UserActivityTable
              activities={activities}
              isLoading={isLoading}
              isFetching={isFetching}
              pageSize={pageSize}
            />
          </CardContent>
        </Card>

        <div className="mt-auto pt-4">
          <TablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            isFetching={isFetching}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              reset();
            }}
          />
        </div>
      </div>
    </div>
  );
}
