import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { useGlobalError } from "@/errors/useGlobalError";

export default function LoginLanding() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuth();
  const handleError = useGlobalError();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      handleError(err as any);
    }
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* LEFT – BRAND */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white px-16 py-14 flex-col justify-between">
        <div>
          <img
            src="/logo.png"
            alt="Varasidhi Furnitures"
            className="h-12 mb-12"
          />

          <h1 className="text-4xl font-semibold leading-tight mb-6">
            Billing & Inventory ERP
            <br />
            Built for Furniture Businesses
          </h1>

          <p className="text-white/80 text-lg max-w-xl leading-relaxed">
            Manage billing, inventory, suppliers, GRN, and reports from one
            unified system designed for real-world operations and daily usage.
          </p>
        </div>

        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} Varasidhi Furnitures. All rights reserved.
        </p>
      </div>

      {/* RIGHT – LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm px-8 py-10">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Sign in to your account
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Use your registered credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@varasidhi.com"
                className="w-full h-11 px-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-11 px-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
