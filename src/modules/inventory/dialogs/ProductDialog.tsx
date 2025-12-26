import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "../forms/ProductForm";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/mutations/product.mutations";
import { Product } from "@/types/product";
import { ProductFormValues } from "@/types/product";
import { useGlobalError } from "@/errors/useGlobalError";
import { AppError } from "@/errors/AppError";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit" | "view";
  product?: Product | null;
};

export default function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: Props) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const handleError = useGlobalError();

  const handleSubmit = async (values: ProductFormValues) => {
  try {
    if (mode === "create") {
      await create.mutateAsync(values);
    }

    if (mode === "edit" && product) {
      await update.mutateAsync({
        id: product.id,
        payload: {
          ...values,
          version: product.version,
        },
      });
    }

    onOpenChange(false);
  } catch (err) {
    handleError(AppError.fromAxiosError(err));
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add Product"
              : mode === "edit"
              ? "Edit Product"
              : "View Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductForm
          defaultValues={product ?? undefined}
          mode={mode}
          loading={create.isPending || update.isPending}
          onSubmit={mode === "view" ? undefined : handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
