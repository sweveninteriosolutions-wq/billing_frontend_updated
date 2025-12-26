import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Supplier,
  SupplierCreateInput,
} from "@/types/supplier";

type Props = {
  defaultValues?: Partial<Supplier>;
  onSubmit?: (values: SupplierCreateInput) => void;
  loading?: boolean;
  mode: "create" | "edit" | "view";
};

export default function SupplierForm({
  defaultValues,
  onSubmit,
  loading = false,
  mode,
}: Props) {
  const form = useForm<SupplierCreateInput>({
    defaultValues: {
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      ...defaultValues,
    },
  });

  const {
    formState: { isDirty },
  } = form;

  /* =========================
     RESET ON SUPPLIER CHANGE
  ========================= */
  useEffect(() => {
    if (defaultValues) {
      form.reset(
        {
          name: defaultValues.name ?? "",
          contact_person: defaultValues.contact_person ?? "",
          phone: defaultValues.phone ?? "",
          email: defaultValues.email ?? "",
        },
        {
          keepDirty: false, // 🔥 reset dirty state
        }
      );
    }
  }, [defaultValues, form]);

  const readOnly = mode === "view";

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = readOnly
    ? undefined
    : form.handleSubmit((values) => {
        onSubmit?.(values);
      });

  /* =========================
     BUTTON DISABLE LOGIC
  ========================= */
  const disableSubmit =
    loading ||
    mode === "view" ||
    (mode === "edit" && !isDirty);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* BASIC INFO */}
      <Input
        placeholder="Name"
        disabled={readOnly || loading}
        {...form.register("name", { required: true })}
      />

      <Input
        placeholder="Contact Person"
        disabled={readOnly || loading}
        {...form.register("contact_person")}
      />

      <Input
        placeholder="Phone"
        disabled={readOnly || loading}
        {...form.register("phone")}
      />

      <Input
        placeholder="Email"
        disabled={readOnly || loading}
        {...form.register("email")}
      />

      {/* ACTIONS */}
      {mode !== "view" && (
        <Button
          type="submit"
          disabled={disableSubmit}
          className="w-full"
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {loading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Supplier"
            : "Update Supplier"}
        </Button>
      )}
    </form>
  );
}
