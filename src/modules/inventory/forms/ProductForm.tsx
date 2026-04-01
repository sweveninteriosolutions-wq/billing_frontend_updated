import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { ProductFormValues } from "@/types/product";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

type Props = {
  defaultValues?: Partial<Product>;
  onSubmit?: (values: ProductFormValues) => void;
  loading?: boolean;
  mode: "create" | "edit" | "view";
};

export default function ProductForm({
  defaultValues,
  onSubmit,
  loading = false,
  mode,
}: Props) {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      price: 0,
      min_stock_threshold: 0,
      supplier_id: undefined,
    },
  });

  const {
    formState: { isDirty },
  } = form;

  /* =========================
     RESET FROM BACKEND PRODUCT
  ========================= */
  useEffect(() => {
    if (!defaultValues) return;

    form.reset(
      {
        sku: defaultValues.sku ?? "",
        name: defaultValues.name ?? "",
        category: defaultValues.category ?? "",
        price: Number(defaultValues.price ?? 0), // ✅ FIX
        min_stock_threshold:
          defaultValues.min_stock_threshold ?? 0,
        supplier_id:
          defaultValues.supplier_id ?? undefined,
      },
      { keepDirty: false }
    );
  }, [defaultValues, form]);

  const readOnly = mode === "view";

  const disableSubmit =
    loading ||
    readOnly ||
    (mode === "edit" && !isDirty);

  const { formState: { errors } } = form;

  return (
    <form
      onSubmit={
        readOnly
          ? undefined
          : form.handleSubmit((values) => {
              onSubmit?.(values);
            })
      }
      className="space-y-4"
    >
      {/* SKU — read-only in edit mode (not in ProductUpdate schema) */}
      <div className="space-y-1">
        <Label htmlFor="prod-sku">SKU *</Label>
        <Input
          id="prod-sku"
          placeholder="e.g. FURN-001"
          disabled={readOnly || loading || mode === 'edit'}
          {...form.register("sku", { required: 'SKU is required' })}
        />
        <FieldError message={errors.sku?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="prod-name">Product Name *</Label>
        <Input
          id="prod-name"
          placeholder="e.g. Wooden Chair"
          disabled={readOnly || loading}
          {...form.register("name", { required: 'Product name is required' })}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="prod-category">Category</Label>
        <Input
          id="prod-category"
          placeholder="e.g. Furniture"
          disabled={readOnly || loading}
          {...form.register("category")}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="prod-price">Price (₹) *</Label>
        <Input
          id="prod-price"
          type="number"
          placeholder="e.g. 4999"
          disabled={readOnly || loading}
          {...form.register("price", {
            valueAsNumber: true,
            required: 'Price is required',
            min: { value: 0.01, message: 'Price must be greater than 0' },
          })}
        />
        <FieldError message={errors.price?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="prod-min-stock">Min Stock Threshold *</Label>
        <Input
          id="prod-min-stock"
          type="number"
          placeholder="e.g. 10"
          disabled={readOnly || loading}
          {...form.register("min_stock_threshold", {
            valueAsNumber: true,
            required: 'Min stock threshold is required',
            min: { value: 0, message: 'Cannot be negative' },
          })}
        />
        <FieldError message={errors.min_stock_threshold?.message} />
      </div>

      {mode !== "view" && (
        <Button
          type="submit"
          disabled={disableSubmit}
          className="w-full"
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {mode === "create"
            ? "Create Product"
            : "Update Product"}
        </Button>
      )}
    </form>
  );
}
