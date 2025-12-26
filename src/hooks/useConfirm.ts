import { useState, useRef } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
};

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = (opts?: ConfirmOptions): Promise<boolean> => {
    setOptions(opts ?? {});
    setOpen(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const onConfirm = () => {
    resolverRef.current?.(true);
    cleanup();
  };

  const onCancel = () => {
    resolverRef.current?.(false);
    cleanup();
  };

  const cleanup = () => {
    setOpen(false);
    resolverRef.current = null;
    setOptions({});
  };

  return {
    open,
    title: options.title ?? "Are you sure?",
    description: options.description ?? "This action cannot be undone.",
    confirm,
    onConfirm,
    onCancel,
  };
}
