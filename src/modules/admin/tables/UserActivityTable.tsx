import { Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { UserActivity } from '@/types/activity';
import { formatToIST } from '@/utils/formatDate';

type Props = {
  activities: UserActivity[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
};

export default function UserActivityTable({
  activities,
  isLoading,
  isFetching,
  pageSize,
}: Props) {
  return (
    <div className="relative rounded-lg border">
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                User
              </th>
              <th className="px-4 py-3 text-left">
                Activity
              </th>
              <th className="px-4 py-3 text-left">
                Time
              </th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton
              rows={pageSize}
              columns={3}
            />
          ) : activities.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Shield className="mx-auto mb-3 h-8 w-8" />
                  No activity logs found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {activities.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {log.username_snapshot}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    {log.message}
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatToIST(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
