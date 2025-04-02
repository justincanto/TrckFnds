import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/providers/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-emerald-50 border-t-4 border-t-neutral-950 rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
