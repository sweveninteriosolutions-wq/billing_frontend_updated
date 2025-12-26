// src/errors/useGlobalError.ts

import { AppError } from "./AppError";
import { mapErrorToAction } from "./errorMapper";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export function useGlobalError() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (error: AppError) => {
    const action = mapErrorToAction(error);

    switch (action.type) {
      case "TOAST":
        toast({
          variant: action.variant === "error" ? "destructive" : "default",
          title: error.message,
        });

        break;

      case "LOGOUT":
        logout();
        navigate("/");
        break;

      case "REDIRECT":
        navigate(action.to);
        break;

      case "SILENT":
        break;
    }
  };
}
