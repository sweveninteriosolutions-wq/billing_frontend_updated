'use client';

import { useState } from 'react';
import { Plus, Eye, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useComplaints } from '@/queries/complaint.queries';
import { usePagination } from '@/hooks/usePagination';
import { TablePagination } from '@/components/TablePagination';
import { format } from 'date-fns';
import { ComplaintStatus, ComplaintPriority } from '@/api/complaint.api';

const STATUS_COLOR: Record<ComplaintStatus, string> = {
  open: 'text-red-600 border-red-300',
  in_progress: 'text-yellow-600 border-yellow-300',
  resolved: 'text-green-600 border-green-300',
  closed: 'text-muted-foreground border-border',
};

const PRIORITY_COLOR: Record<ComplaintPriority, string> = {
  low: 'text-muted-foreground',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  critical: 'text-red-600',
};

export default function ComplaintsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');

  const { page, pageSize, setPage } = usePagination({ initialPage: 1, initialPageSize: 20 });

  const { data, isLoading } = useComplaints({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  const open = items.filter(c => c.status === 'open').length;
  const inProgress = items.filter(c => c.status === 'in_progress').length;
  const critical = items.filter(c => c.priority === 'critical' || c.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Complaints</h1>
          <p className="text-muted-foreground">Track and resolve customer issues</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-3xl font-bold text-red-600">{open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600">{inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">High / Critical</p>
            <p className="text-3xl font-bold text-orange-600">{critical}</p>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search complaints..."
              className="w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No complaints found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs font-semibold">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-center">Priority</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(c => (
                    <tr key={c.id} className="border-t hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{c.id}</td>
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{c.title}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold uppercase ${PRIORITY_COLOR[c.priority]}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`capitalize ${STATUS_COLOR[c.status]}`}>
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.created_at
                          ? format(new Date(c.created_at), 'dd MMM yyyy')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
        />
      )}
    </div>
  );
}
