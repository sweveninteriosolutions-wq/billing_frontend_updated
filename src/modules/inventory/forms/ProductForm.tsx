import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { ProductFormValues } from "@/types/product";

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

  return (
    <form
      onSubmit={
        readOnly
          ? undefined
          : form.handleSubmit((values) => {
              onSubmit?.(values); // ✅ typed correctly
            })
      }
      className="space-y-4"
    >
      <Input
        placeholder="SKU"
        disabled={readOnly || loading}
        {...form.register("sku", { required: true })}
      />

      <Input
        placeholder="Name"
        disabled={readOnly || loading}
        {...form.register("name", { required: true })}
      />

      <Input
        placeholder="Category"
        disabled={readOnly || loading}
        {...form.register("category")}
      />

      <Input
        type="number"
        placeholder="Price"
        disabled={readOnly || loading}
        {...form.register("price", {
          valueAsNumber: true, // ✅ FIX
          min: 0,
        })}
      />

      <Input
        type="number"
        placeholder="Min Stock Threshold"
        disabled={readOnly || loading}
        {...form.register("min_stock_threshold", {
          valueAsNumber: true, // ✅ FIX
          min: 0,
        })}
      />

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
