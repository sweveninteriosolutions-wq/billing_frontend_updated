import {
  Edit,
  Trash2,
  RotateCcw,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { UserListItem } from '@/types/users';
import { formatToIST } from '@/utils/formatDate';

type Props = {
  users: UserListItem[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  currentUserId?: number;
  onEdit: (u: UserListItem) => void;
  onDeactivate: (u: UserListItem) => void;
  onActivate: (u: UserListItem) => void;
};

export default function UsersTable({
  users,
  isLoading,
  isFetching,
  pageSize,
  currentUserId,
  onEdit,
  onDeactivate,
  onActivate,
}: Props) {
  const roleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'sales':
        return 'default';
      case 'inventory':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="relative rounded-lg border">
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                Username
              </th>
              <th className="px-4 py-3 text-left">
                Role
              </th>
              <th className="px-4 py-3 text-left">
                Online
              </th>
              <th className="px-4 py-3 text-left">
                Last Login
              </th>
              <th className="px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton
              rows={pageSize}
              columns={5}
            />
          ) : users.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Users className="mx-auto mb-3 h-8 w-8" />
                  No users found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {users.map((u) => {
                const isSelf =
                  currentUserId === u.id;

                return (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      {u.username}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={roleVariant(u.role)}>
                        {u.role}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          u.is_online
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {u.is_online
                          ? 'Online'
                          : 'Offline'}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {u.last_login
                        ? formatToIST(u.last_login)
                        : '—'}
                    </td>

                    <td className="px-4 py-3 text-center space-x-1">
                      {u.is_active ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSelf}
                            title={
                              isSelf
                                ? 'Cannot edit yourself'
                                : 'Edit'
                            }
                            onClick={() => onEdit(u)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {!isSelf && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() =>
                                onDeactivate(u)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onActivate(u)
                          }
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
