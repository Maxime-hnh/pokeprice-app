import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref, get } from "firebase/database";
import { authStore } from "../../_store/auth.store";
// import { db } from "../../_config/firebaseConfig";

interface ProtectedRouteProps {
  requiredRole: string;
}
const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { loggedUser } = authStore;

  const verifyUser = async () => {
    // setLoading(true)
    // const userRef = ref(db, `users/${loggedUser.uid}/role`);
    // const snapshot = await get(userRef);
    // if (snapshot.exists()) {
    //   setRole(snapshot.val());
    // } else {
    //   setRole(null);
    // }
    // setLoading(false);
  }

  useEffect(() => {
    verifyUser();
  }, [])

  if (loading) return <div>Chargement...</div>;

  if (!loggedUser) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
