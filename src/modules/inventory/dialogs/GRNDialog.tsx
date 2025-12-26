'use client';

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { SearchSelect } from "@/components/ui/SearchSelect";

import { GRNView } from "@/types/grn";
import { useCreateGRN, useUpdateGRN } from "@/mutations/grn.mutations";
import { useProducts } from "@/queries/product.queries";
import { useSuppliers } from "@/queries/supplier.queries";

// 🔴 Global error handling
import { AppError } from "@/errors/AppError";
import { useGlobalError } from "@/errors/useGlobalError";

type Mode = "create" | "edit" | "view";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: Mode;
  grn?: GRNView | null;
};

const FIXED_LOCATION_ID = 1;

type FormItem = {
  product_id: string;
  quantity: string;
  unit_cost: string;
};

export default function GRNDialog({
  open,
  onOpenChange,
  mode,
  grn,
}: Props) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  /* =========================
     GLOBAL ERROR HANDLER
  ========================= */
  const handleError = useGlobalError();

  const createGRN = useCreateGRN();
  const updateGRN = useUpdateGRN();

  const isSubmitting =
    createGRN.isPending || updateGRN.isPending;

  const { data: products } = useProducts({
    page: 1,
    page_size: 50,
  });

  const { data: supplierData } = useSuppliers({
    limit: 100,
    offset: 0,
  });

  const suppliers =
    supplierData?.items?.filter(s => !s.is_deleted) ?? [];

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState<{
    supplier_id: string;
    purchase_order: string;
    bill_number: string;
    notes: string;
    items: FormItem[];
  }>({
    supplier_id: "",
    purchase_order: "",
    bill_number: "",
    notes: "",
    items: [{ product_id: "", quantity: "", unit_cost: "" }],
  });

  /* =========================
     INIT FORM (EDIT)
  ========================= */
  useEffect(() => {
    if (!grn || isView) return;

    setForm({
      supplier_id: String(grn.supplier.id),
      purchase_order: grn.purchase_order ?? "",
      bill_number: grn.bill_number ?? "",
      notes: "",
      items: grn.items.map(i => ({
        product_id: String(i.product.id),
        quantity: String(i.quantity),
        unit_cost: String(i.unit_cost),
      })),
    });
  }, [grn, isView]);

  /* =========================
     BUILD PAYLOAD
  ========================= */
  const buildPayload = () => ({
    supplier_id: Number(form.supplier_id),
    location_id: FIXED_LOCATION_ID,
    purchase_order: form.purchase_order || undefined,
    bill_number: form.bill_number || undefined,
    notes: form.notes || undefined,
    items: form.items.map(i => ({
      product_id: Number(i.product_id),
      quantity: Number(i.quantity),
      unit_cost: Number(i.unit_cost),
    })),
  });

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    try {
      if (isCreate) {
        await createGRN.mutateAsync(buildPayload());
      }

      if (isEdit && grn) {
        await updateGRN.mutateAsync({
          id: grn.id,
          payload: {
            ...buildPayload(),
            version: grn.version,
          },
        });
      }

      onOpenChange(false);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  /* =========================
     LOADING GUARD
  ========================= */
  if (isView && !grn) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <p className="text-center text-muted-foreground">
            Loading GRN details…
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          {isCreate && "Create GRN"}
          {isEdit && "Edit GRN"}
          {isView && (
            <div className="flex items-center gap-2">
              {grn?.code}
              <Badge className="capitalize">
                {grn?.status}
              </Badge>
            </div>
          )}
        </DialogHeader>

        {/* =========================
            VIEW MODE
        ========================= */}
        {isView && grn && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p className="font-medium">
                  {grn.supplier.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">
                  {grn.location.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Purchase Order
                </p>
                <p className="font-medium">
                  {grn.purchase_order ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Bill Number
                </p>
                <p className="font-medium">
                  {grn.bill_number ?? "—"}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div>
              <p className="font-semibold mb-2">Items</p>
              <div className="border rounded-lg divide-y">
                {grn.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-5 gap-2 p-3"
                  >
                    <div className="col-span-2">
                      <p className="font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.quantity}
                    </div>
                    <div className="text-right">
                      ₹{item.unit_cost}
                    </div>
                    <div className="text-right font-semibold">
                      ₹{item.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">
                  No of Items
                </p>
                <p className="font-medium">
                  {grn.summary.no_of_items}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Total Value
                </p>
                <p className="font-bold text-lg">
                  ₹{grn.summary.total_value}
                </p>
              </div>
            </div>

            {/* AUDIT */}
            <div className="border-t pt-4">
              <p className="font-semibold mb-2">Audit</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">
                    Created By
                  </p>
                  <p>{grn.audit.created_by}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      grn.audit.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                {grn.audit.updated_by && (
                  <div>
                    <p className="text-muted-foreground">
                      Updated By
                    </p>
                    <p>{grn.audit.updated_by}</p>
                    <p className="text-xs text-muted-foreground">
                      {grn.audit.updated_at
                        ? new Date(
                            grn.audit.updated_at
                          ).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================
            CREATE / EDIT MODE
        ========================= */}
        {!isView && (
          <>
            <SearchSelect
              value={form.supplier_id}
              onChange={v =>
                setForm(f => ({ ...f, supplier_id: v }))
              }
              options={suppliers.map(s => ({
                value: String(s.id),
                label: s.name,
              }))}
              placeholder="Select supplier"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Purchase Order"
                value={form.purchase_order}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    purchase_order: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Bill Number"
                value={form.bill_number}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    bill_number: e.target.value,
                  }))
                }
              />
            </div>

            <Input
              placeholder="Notes"
              value={form.notes}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  notes: e.target.value,
                }))
              }
            />

            <div className="space-y-2">
              <p className="font-semibold">Items</p>

              {form.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-2"
                >
                  <SearchSelect
                    value={item.product_id}
                    onChange={v => {
                      const items = [...form.items];
                      items[idx].product_id = v;
                      setForm({ ...form, items });
                    }}
                    options={
                      products?.items.map(p => ({
                        value: String(p.id),
                        label: `${p.name} (${p.sku})`,
                      })) ?? []
                    }
                    placeholder="Select product"
                  />

                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => {
                      const items = [...form.items];
                      items[idx].quantity = e.target.value;
                      setForm({ ...form, items });
                    }}
                  />

                  <Input
                    type="number"
                    placeholder="Unit Cost"
                    value={item.unit_cost}
                    onChange={e => {
                      const items = [...form.items];
                      items[idx].unit_cost = e.target.value;
                      setForm({ ...form, items });
                    }}
                  />
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm(f => ({
                    ...f,
                    items: [
                      ...f.items,
                      {
                        product_id: "",
                        quantity: "",
                        unit_cost: "",
                      },
                    ],
                  }))
                }
              >
                + Add Item
              </Button>
            </div>

            <Button
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isCreate
                  ? "Creating…"
                  : "Updating…"
                : isCreate
                ? "Create GRN"
                : "Update GRN"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
