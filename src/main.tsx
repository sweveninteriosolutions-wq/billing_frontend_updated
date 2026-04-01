import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";

import { ErrorBoundary } from "@/errors/ErrorBoundary";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx (auth/permission errors)
        if (error?.errorCode === 'UNAUTHORIZED' || error?.errorCode === 'PERMISSION_DENIED') return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,  // 30s default stale time — prevents hammering the API
    },
    mutations: {
      retry: 0,
    },
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Root element missing");

createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
              <Toaster />
              <Sonner />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
