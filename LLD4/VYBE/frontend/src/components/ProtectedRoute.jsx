import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({children,role})=>{
  const {user,token,loading} = useAuth();
  if(loading){
    return null
  }
  if(!token){
    return <Navigate to="/login" replace/> // redirection
  }
  if(role && user.role !== role){
    return <Navigate to={homeFor(user?.role)} replace />;
  }
  return children
}

export default ProtectedRoute