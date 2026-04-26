import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const UserProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const isRehydrated = useSelector((store) => store?._persist?.rehydrated);

  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold">Login Required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please login first to access this page.
          </p>
          <Link to="/login" className="inline-block mt-5">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectedRoute;