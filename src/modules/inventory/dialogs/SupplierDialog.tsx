import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SupplierForm from "../forms/SupplierForm";
import {
  useCreateSupplier,
  useUpdateSupplier,
} from "@/mutations/supplier.mutations";
import { Supplier } from "@/types/supplier";
import { useGlobalError } from "@/errors/useGlobalError";
import { AppError } from "@/errors/AppError";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit" | "view";
  supplier?: Supplier | null;
};

export default function SupplierDialog({
  open,
  onOpenChange,
  mode,
  supplier,
}: Props) {
  const create = useCreateSupplier();
  const update = useUpdateSupplier();
  const handleError = useGlobalError();

  const handleSubmit = async (values: any) => {
    try {
      if (mode === "create") {
        await create.mutateAsync(values);
        toast.success("Supplier created");
      }

      if (mode === "edit" && supplier) {
        await update.mutateAsync({
          id: supplier.id,
          payload: { ...values, version: supplier.version },
        });
        toast.success("Supplier updated");
      }

      onOpenChange(false);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add Supplier"
              : mode === "edit"
              ? "Edit Supplier"
              : "View Supplier"}
          </DialogTitle>
        </DialogHeader>

        <SupplierForm
          defaultValues={supplier ?? undefined}
          mode={mode}
          loading={create.isPending || update.isPending}
          onSubmit={mode === "view" ? undefined : handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
