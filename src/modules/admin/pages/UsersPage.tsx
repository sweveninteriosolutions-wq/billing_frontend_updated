'use client';

import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TablePagination } from '@/components/TablePagination';
import { useToast } from '@/components/ui/use-toast';

import UserDialog from '../dialogs/UserDialog';
import UsersTable from '../tables/UsersTable';

import { useUsers } from '@/queries/users.queries';
import {
  useDeactivateUser,
  useActivateUser,
} from '@/mutations/user.mutations';

import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfirm } from '@/hooks/useConfirm';
import ConfirmDialog from '@/components/ConfirmDialog';

import { UserListItem, UserDetail } from '@/types/users';
import { getUserById } from '@/api/user.api';
import { useAuth } from '@/providers/AuthProvider';

const DEFAULT_PAGE_SIZE = 10;

export default function UsersPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const currentUserId = session?.id;

  const confirm = useConfirm();

  /* =========================
     FILTERS
  ========================= */
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string | undefined>();
  const [includeInactive, setIncludeInactive] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

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
  const { data, isLoading, isFetching } = useUsers({
    search: debouncedSearch || undefined,
    role,
    is_active: includeInactive ? undefined : true,
    page,
    page_size: pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const deactivateUser = useDeactivateUser();
  const activateUser = useActivateUser();

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] =
    useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /* =========================
     HANDLERS
  ========================= */
  const handleEdit = async (user: UserListItem) => {
    try {
      setLoadingDetail(true);
      const res = await getUserById(user.id);
      setSelectedUser(res.data);
      setDialogMode('edit');
      setDialogOpen(true);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load user details',
        variant: 'destructive',
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeactivate = async (user: UserListItem) => {
    const ok = await confirm.confirm({
      title: 'Deactivate user',
      description: `Deactivate ${user.username}?`,
    });

    if (!ok) return;

    await deactivateUser.mutateAsync({
      id: user.id,
      payload: { version: user.version },
    });

    toast({ title: 'User deactivated successfully' });
  };

  const handleActivate = async (user: UserListItem) => {
    const ok = await confirm.confirm({
      title: 'Activate user',
      description: `Activate ${user.username}?`,
    });

    if (!ok) return;

    await activateUser.mutateAsync({
      id: user.id,
      payload: { version: user.version },
    });

    toast({ title: 'User activated successfully' });
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage system users and permissions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search username"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
            className="w-48"
          />

          <select
            className="border rounded px-3 py-2 text-sm"
            value={role ?? 'all'}
            onChange={(e) => {
              setRole(
                e.target.value === 'all'
                  ? undefined
                  : e.target.value
              );
              reset();
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
            <option value="inventory">Inventory</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => {
                setIncludeInactive(e.target.checked);
                reset();
              }}
              className="h-4 w-4 accent-primary"
            />
            Include inactive users
          </label>

          <Button
            onClick={() => {
              setSelectedUser(null);
              setDialogMode('create');
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5" />
              Users
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <UsersTable
              users={users}
              isLoading={isLoading}
              isFetching={isFetching}
              pageSize={pageSize}
              currentUserId={currentUserId}
              onEdit={handleEdit}
              onDeactivate={handleDeactivate}
              onActivate={handleActivate}
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

      {/* CONFIRM */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* DIALOG */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={selectedUser}
      />
    </div>
  );
}
