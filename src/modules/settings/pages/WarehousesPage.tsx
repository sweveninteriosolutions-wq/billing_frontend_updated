'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Warehouse, MapPin, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useWarehouses } from '@/queries/warehouse.queries';
import { getWarehouse } from '@/api/warehouse.api';
import {
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/mutations/warehouse.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';
import { WarehouseListItem, WarehouseOut } from '@/types/warehouse';

/* ==========================================
   EMPTY FORM STATE
========================================== */
const emptyForm = {
  code: '',
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstin: '',
  phone: '',
  is_active: true,
};

export default function WarehousesPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();

  /* ---- Data ---- */
  const { data, isLoading } = useWarehouses({ include_inactive: true });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  /* ---- Mutations ---- */
  const create = useCreateWarehouse();
  const update = useUpdateWarehouse();
  const del = useDeleteWarehouse();

  /* ---- Dialog State ---- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<WarehouseOut | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  /* ---- Handlers ---- */
  const openCreate = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const openEdit = async (wh: WarehouseListItem) => {
    // Fetch full detail so address, pincode, gstin, phone are pre-populated
    try {
      const detail = await getWarehouse(wh.id);
      setForm({
        code: detail.code,
        name: detail.name,
        address: detail.address ?? '',
        city: detail.city ?? '',
        state: detail.state ?? '',
        pincode: detail.pincode ?? '',
        gstin: detail.gstin ?? '',
        phone: detail.phone ?? '',
        is_active: detail.is_active,
      });
      setEditTarget(detail);
    } catch {
      // Fallback to list-item data if detail fetch fails
      setForm({
        code: wh.code,
        name: wh.name,
        address: '',
        city: wh.city ?? '',
        state: wh.state ?? '',
        pincode: '',
        gstin: '',
        phone: '',
        is_active: wh.is_active,
      });
      setEditTarget({ ...wh, version: 1 } as any);
    }
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (dialogMode === 'create') {
        await create.mutateAsync({
          code: form.code,
          name: form.name,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          pincode: form.pincode || undefined,
          gstin: form.gstin || undefined,
          phone: form.phone || undefined,
          is_active: form.is_active,
        });
      } else if (editTarget) {
        await update.mutateAsync({
          id: editTarget.id,
          payload: {
            name: form.name,
            address: form.address || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            pincode: form.pincode || undefined,
            gstin: form.gstin || undefined,
            phone: form.phone || undefined,
            is_active: form.is_active,
            version: (editTarget as any).version ?? 1,
          },
        });
      }
      setDialogOpen(false);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (wh: WarehouseListItem) => {
    const ok = await confirm.confirm({
      title: 'Delete Warehouse',
      description: `Delete "${wh.name}"? Locations linked to it will be unlinked. This cannot be undone.`,
    });
    if (!ok) return;
    try {
      await del.mutateAsync(wh.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  /* ---- Stats ---- */
  const active = items.filter(w => w.is_active).length;
  const inactive = items.filter(w => !w.is_active).length;
  const totalLocations = items.reduce((s, w) => s + (w.locations_count ?? 0), 0);

  /* ---- Render ---- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations for multi-location inventory
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Warehouse
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Warehouses" value={total} icon={Warehouse} />
        <StatCard label="Active" value={active} icon={CheckCircle} success />
        <StatCard label="Total Locations" value={totalLocations} icon={MapPin} info />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Warehouse className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No warehouses found. Create your first warehouse.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs font-semibold">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">City</th>
                    <th className="px-4 py-3 text-left">State</th>
                    <th className="px-4 py-3 text-center">Locations</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(wh => (
                    <tr key={wh.id} className="border-t hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">
                        {wh.code}
                      </td>
                      <td className="px-4 py-3 font-medium">{wh.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{wh.city ?? '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{wh.state ?? '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary">{wh.locations_count ?? 0}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {wh.is_active ? (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive/30">
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit"
                            onClick={() => openEdit(wh)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete"
                            onClick={() => handleDelete(wh)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CONFIRM */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'New Warehouse' : 'Edit Warehouse'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Code (create only) */}
            {dialogMode === 'create' && (
              <div className="grid gap-1.5">
                <Label>Warehouse Code *</Label>
                <Input
                  placeholder="e.g. MAIN-WH"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                placeholder="e.g. Main Warehouse"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Address</Label>
              <Input
                placeholder="Street address"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>City</Label>
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>State</Label>
                <Input
                  placeholder="State"
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Pincode</Label>
                <Input
                  placeholder="560001"
                  value={form.pincode}
                  onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Phone</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>GSTIN</Label>
              <Input
                placeholder="29XXXXX0000X1Z5"
                value={form.gstin}
                onChange={e => setForm(f => ({ ...f, gstin: e.target.value.toUpperCase() }))}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))}
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !form.name.trim() || (dialogMode === 'create' && !form.code.trim())}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {dialogMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---- STAT CARD ---- */
function StatCard({
  label,
  value,
  icon: Icon,
  success,
  info,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  success?: boolean;
  info?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div
          className={`rounded-full p-3 ${
            success
              ? 'bg-green-100 text-green-600'
              : info
              ? 'bg-blue-100 text-blue-600'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
