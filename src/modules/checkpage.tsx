import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

const LandingPage = () => {
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useAuth();

  // Not logged in
  if (!isAuthenticated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 text-sm">You are not logged in</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Logged in
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">
          Logged In Session
        </h1>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Role:</span>{" "}
            {session.role}
          </div>
          <div>
            <span className="font-medium">Token Type:</span>{" "}
            {session.tokenType}
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
