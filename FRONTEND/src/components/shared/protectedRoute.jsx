import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
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

    if (!user || user.role !== "recruiter") {
        return <Navigate to="/" replace />;
    }

    return (
        <>{children}</>
    );
};
export default ProtectedRoute;