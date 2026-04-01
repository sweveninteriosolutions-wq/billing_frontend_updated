import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Supplier,
  SupplierCreateInput,
} from "@/types/supplier";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

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
      address: "",
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
          address: (defaultValues as any).address ?? "",
        },
        {
          keepDirty: false,
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

  const { formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* BASIC INFO */}
      <div className="space-y-1">
        <Label htmlFor="sup-name">Supplier Name *</Label>
        <Input
          id="sup-name"
          placeholder="e.g. Nilkamal Ltd."
          disabled={readOnly || loading}
          {...form.register("name", { required: 'Supplier name is required' })}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="sup-contact">Contact Person</Label>
        <Input
          id="sup-contact"
          placeholder="e.g. Ramesh Sharma"
          disabled={readOnly || loading}
          {...form.register("contact_person")}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="sup-phone">Phone</Label>
        <Input
          id="sup-phone"
          placeholder="e.g. 9876543210"
          disabled={readOnly || loading}
          {...form.register("phone")}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="sup-email">Email</Label>
        <Input
          id="sup-email"
          type="email"
          placeholder="e.g. supplier@example.com"
          disabled={readOnly || loading}
          {...form.register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="sup-address">Address</Label>
        <Input
          id="sup-address"
          placeholder="e.g. 12, Industrial Area, Bangalore"
          disabled={readOnly || loading}
          {...form.register("address")}
        />
      </div>

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
